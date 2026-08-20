import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadToCloudinary } from '../config/cloudinary.js';
import pool from '../config/db.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';
import { loginLimiter, forgotPasswordLimiter, sensitiveLimiter, refreshTokenLimiter } from '../middleware/rate-limit.js';
import { validateRegistrationInput, validateCollege } from '../middleware/validation.js';
import { rotateCsrfToken } from '../middleware/csrf.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../public/uploads/');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const profileUpload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Email transporter setup from environment
let emailTransporter;

if (process.env.NODE_ENV !== 'production' && (
  !process.env.EMAIL_PASSWORD ||
  process.env.EMAIL_PASSWORD === 'YOUR_RESEND_API_KEY_HERE' ||
  process.env.EMAIL_PASSWORD.trim() === ''
)) {
  console.warn('[WARNING] No email configuration password provided. Falling back to console logging transporter for development.');
  emailTransporter = {
    sendMail: async (options) => {
      console.log('========================================');
      console.log('[MOCK EMAIL SENT]');
      console.log(`From: ${options.from}`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log('----------------------------------------');
      const linkMatch = options.html.match(/href="([^"]+)"/);
      if (linkMatch) {
        console.log(`Link: ${linkMatch[1]}`);
      }
      const otpMatch = options.html.match(/>([0-9]{6})</);
      if (otpMatch) {
        console.log(`OTP Code: ${otpMatch[1]}`);
      }
      console.log('========================================');
      return { messageId: 'mock-id-' + Date.now() };
    },
    verify: async () => true
  };
} else {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.resend.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' }); // Short-lived access token
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' }); // Long-lived refresh token
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const escapeHtml = (text) => {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Register user
router.post('/register', sensitiveLimiter, validateRegistrationInput, async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password;
    const name = req.body.name.trim();
    const college = req.body.college.trim();

    const connection = await pool.getConnection();
    const [existing] = await connection.query('SELECT id, email_verified FROM users WHERE email = ?', [email]);
    
    // Cryptographically secure random OTP (Issue #2 of Critical list)
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expires = new Date(Date.now() + 15 * 60000); // 15 mins
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cryptographically secure and unique verification token (Issue #3 of High list)
    let verificationToken;
    let collision = true;
    let attempts = 0;
    while (collision) {
      verificationToken = crypto.randomBytes(32).toString('hex');
      const [existingToken] = await connection.query('SELECT id FROM users WHERE email_verification_token = ?', [verificationToken]);
      if (existingToken.length === 0) {
        collision = false;
      }
      attempts++;
      if (attempts > 10) {
        connection.release();
        return res.status(500).json({ error: 'Failed to generate a secure email verification token' });
      }
    }

    if (existing.length > 0) {
      if (existing[0].email_verified) {
        connection.release();
        return res.status(409).json({ error: 'Email already registered' });
      }
      
      await connection.query(
        'UPDATE users SET password = ?, name = ?, college = ?, otp_code = ?, otp_expires = ?, email_verification_token = ? WHERE id = ?',
        [hashedPassword, name, college, otp, expires, verificationToken, existing[0].id]
      );
    } else {
      await connection.query(
        'INSERT INTO users (email, password, name, college, email_verified, otp_code, otp_expires, email_verification_token) VALUES (?, ?, ?, ?, 0, ?, ?, ?)',
        [email, hashedPassword, name, college, otp, expires, verificationToken]
      );
    }
    connection.release();

    console.log('[SECURITY AUDIT] User registered / requested verification', { email, name });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyLink = `${frontendUrl}/verify-email/${verificationToken}`;

    // Send verification email with OTP and Link (Issue #6 of Critical list & Issue #3 of High list)
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@collegemart.in',
      to: email,
      subject: 'Email Verification OTP — CollegeMart',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0ea5e9; text-align: center;">Verify Your Email Address</h2>
        <p>Hello ${escapeHtml(name)},</p>
        <p>Thank you for signing up for CollegeMart! Please enter this 6-digit One-Time Password (OTP) or click the verification link below. Expiry: 15 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0ea5e9; padding: 10px 20px; border: 2px dashed #0ea5e9; border-radius: 4px; display: inline-block;">${otp}</span>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Link</a>
        </div>
      </div>`
    });

    res.json({ email, message: 'OTP sent to your email!' });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// Verify OTP
router.post('/verify-otp', sensitiveLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, email, name, college, phone, profile_image, coins, otp_code, otp_expires FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    if (user.otp_code !== otp || new Date(user.otp_expires) < new Date()) {
      connection.release();
      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }

    await connection.query(
      'UPDATE users SET email_verified = 1, otp_code = NULL, otp_expires = NULL WHERE id = ?',
      [user.id]
    );
    connection.release();

    console.log('[SECURITY AUDIT] User verified email successfully', { userId: user.id, email });

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college,
        phone: user.phone,
        profile_image: user.profile_image,
        coins: user.coins
      },
      token: accessToken,
      message: 'Account verified successfully!'
    });
  } catch (error) {
    console.error('[VERIFY OTP ERROR]', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', sensitiveLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, name, email, email_verified, email_verification_token FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    if (user.email_verified) {
      connection.release();
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate cryptographically secure random OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expires = new Date(Date.now() + 15 * 60000); // 15 mins

    // Ensure we have a verification token
    let verificationToken = user.email_verification_token;
    if (!verificationToken) {
      let collision = true;
      let attempts = 0;
      while (collision) {
        verificationToken = crypto.randomBytes(32).toString('hex');
        const [existingToken] = await connection.query('SELECT id FROM users WHERE email_verification_token = ?', [verificationToken]);
        if (existingToken.length === 0) {
          collision = false;
        }
        attempts++;
        if (attempts > 10) {
          connection.release();
          return res.status(500).json({ error: 'Failed to generate a secure email verification token' });
        }
      }
    }

    await connection.query(
      'UPDATE users SET otp_code = ?, otp_expires = ?, email_verification_token = ? WHERE id = ?',
      [otp, expires, verificationToken, user.id]
    );
    connection.release();

    console.log('[SECURITY AUDIT] User requested OTP resend', { email });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyLink = `${frontendUrl}/verify-email/${verificationToken}`;

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@collegemart.in',
      to: email,
      subject: 'Email Verification OTP — CollegeMart',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0ea5e9; text-align: center;">Verify Your Email Address</h2>
        <p>Hello ${escapeHtml(user.name)},</p>
        <p>Thank you for signing up for CollegeMart! Please enter this 6-digit One-Time Password (OTP) or click the verification link below. Expiry: 15 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0ea5e9; padding: 10px 20px; border: 2px dashed #0ea5e9; border-radius: 4px; display: inline-block;">${otp}</span>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Link</a>
        </div>
      </div>`
    });

    res.json({ message: 'New OTP sent to email!' });
  } catch (error) {
    console.error('[RESEND OTP ERROR]', error);
    res.status(500).json({ error: 'Failed to resend OTP.' });
  }
});

// Refresh Token (Issue #7 of Critical list)
router.post('/refresh-token', refreshTokenLimiter, async (req, res) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );

  const refreshToken = cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  jwt.verify(refreshToken, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    try {
      const [rows] = await pool.query('SELECT id, email, name, college, phone, profile_image, coins, is_banned FROM users WHERE id = ?', [payload.id]);
      if (rows.length === 0 || rows[0].is_banned) {
        return res.status(401).json({ error: 'User not found or banned' });
      }

      const user = rows[0];
      const accessToken = generateToken(user);
      const newRefreshToken = generateRefreshToken(user);
      setRefreshTokenCookie(res, newRefreshToken);

      // Rotate CSRF token on refresh (Issue #6 of Critical list)
      rotateCsrfToken(req, res);

      res.json({ token: accessToken });
    } catch (error) {
      res.status(500).json({ error: 'Token refresh failed' });
    }
  });
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = req.body.password;

    if (!email || typeof password !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      return res.status(400).json({ error: 'Invalid login input' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, email, password, name, college, phone, profile_image, coins, email_verified, is_banned FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    if (user.is_banned) {
      connection.release();
      return res.status(403).json({ error: 'Your account has been banned' });
    }

    if (!user.email_verified) {
      connection.release();
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      connection.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    connection.release();

    console.log('[SECURITY AUDIT] User logged in', { userId: user.id, email });

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    // Rotate CSRF token on login (Issue #6 of Critical list)
    rotateCsrfToken(req, res);

    delete user.password;
    delete user.email_verified;
    delete user.is_banned;

    res.json({ user, token: accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth Client Initialization
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login Endpoint
router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid token payload' });
    }

    const email = payload.email.toLowerCase().trim();
    const name = payload.name || 'Google User';
    const profileImage = payload.picture || null;

    const connection = await pool.getConnection();
    
    // Check if the user exists
    const [rows] = await connection.query(
      'SELECT id, email, name, college, phone, profile_image, coins, email_verified, is_banned FROM users WHERE email = ?',
      [email]
    );

    let user;

    if (rows.length === 0) {
      // Create user if they don't exist
      // Since Google verified the email, we mark email_verified = 1.
      // Generate a random secure placeholder password since password column is NOT NULL
      const placeholderPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      
      const [insertResult] = await connection.query(
        'INSERT INTO users (email, password, name, email_verified, profile_image, coins) VALUES (?, ?, ?, 1, ?, 0)',
        [email, placeholderPassword, name, profileImage]
      );
      
      user = {
        id: insertResult.insertId,
        email,
        name,
        college: null,
        phone: null,
        profile_image: profileImage,
        coins: 0
      };
    } else {
      user = rows[0];
      if (user.is_banned) {
        connection.release();
        return res.status(403).json({ error: 'Your account has been banned' });
      }

      // If user wasn't verified before, mark them as verified now
      if (!user.email_verified) {
        await connection.query('UPDATE users SET email_verified = 1 WHERE id = ?', [user.id]);
        user.email_verified = 1;
      }
      
      // Optionally update profile image if none was set
      if (!user.profile_image && profileImage) {
        await connection.query('UPDATE users SET profile_image = ? WHERE id = ?', [profileImage, user.id]);
        user.profile_image = profileImage;
      }
    }

    connection.release();

    console.log('[SECURITY AUDIT] User logged in via Google OAuth', { userId: user.id, email });

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    // Rotate CSRF token on login
    rotateCsrfToken(req, res);

    delete user.password;
    delete user.email_verified;
    delete user.is_banned;

    res.json({ user, token: accessToken });
  } catch (error) {
    console.error('[GOOGLE-LOGIN ERROR]', error);
    res.status(500).json({ error: 'Google login failed on backend' });
  }
});

// Forgot Password
router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT id, name, email FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'No user found with this email' });
    }

    const user = users[0];
    
    // TOKEN COLLISION FIX: verify uniqueness of generated token
    let token;
    let collision = true;
    while (collision) {
      token = crypto.randomBytes(32).toString('hex');
      const [existing] = await connection.query('SELECT id FROM users WHERE password_reset_token = ?', [token]);
      if (existing.length === 0) {
        collision = false;
      }
    }

    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await connection.query(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [token, expires, user.id]
    );
    connection.release();

    console.log('[SECURITY AUDIT] User requested password reset', { userId: user.id, email });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@collegemart.in',
      to: user.email,
      subject: 'Password Reset Request — CollegeMart',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0ea5e9; text-align: center;">Reset Your Password</h2>
        <p>Hello ${escapeHtml(user.name)},</p>
        <p>Click the link below to choose a new password. Link validity: 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
      </div>`
    });

    res.json({ message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    console.error('[FORGOT-PASSWORD ERROR]', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, email FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      'UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );
    connection.release();

    console.log('[SECURITY AUDIT] User reset password successfully', { userId: user.id, email: user.email });

    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get User Profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, name, college, phone, profile_image, coins FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.id, 10) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, college, phone } = req.body;
    const profileImageInput = req.body.profileImage !== undefined ? req.body.profileImage : req.body.profile_image;

    // Validate college against whitelist
    if (college && !validateCollege(college)) {
      return res.status(400).json({ error: 'Invalid college selected' });
    }

    const connection = await pool.getConnection();
    
    // Fetch existing profile image to prevent overwriting with null if not provided
    const [existing] = await connection.query('SELECT profile_image FROM users WHERE id = ?', [req.user.id]);
    const currentImage = existing[0]?.profile_image || null;
    const finalImage = profileImageInput !== undefined ? (profileImageInput || null) : currentImage;

    await connection.query(
      'UPDATE users SET name = ?, college = ?, phone = ?, profile_image = ? WHERE id = ?',
      [name, college, phone, finalImage, req.user.id]
    );
    const [rows] = await connection.query('SELECT id, email, name, college, phone, profile_image, coins FROM users WHERE id = ?', [req.user.id]);
    connection.release();

    console.log('[SECURITY AUDIT] User updated profile details', { userId: req.user.id });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /verify-email/:token (Issue #6 of Critical list)
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id FROM users WHERE email_verification_token = ? AND email_verified = 0',
      [token]
    );
    if (users.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'Invalid or expired email verification token' });
    }
    const userId = users[0].id;
    await connection.query(
      'UPDATE users SET email_verified = 1, email_verification_token = NULL, otp_code = NULL, otp_expires = NULL WHERE id = ?',
      [userId]
    );
    connection.release();
    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// POST /logout (Issue #4 of High list)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 15 * 60 * 1000);
      
      // Blacklist access token
      await pool.query('INSERT IGNORE INTO token_blacklist (token, expires_at) VALUES (?, ?)', [token, expiresAt]);
    }
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });
    
    // Rotate CSRF token
    rotateCsrfToken(req, res);
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// POST /users/:id/upload-profile-image
router.post('/:id/upload-profile-image', authenticateToken, profileUpload.single('profileImage'), async (req, res) => {
  try {
    if (parseInt(req.params.id, 10) !== req.user.id) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary (falls back to local disk if not configured)
    const imageUrl = await uploadToCloudinary(req.file.path, 'profiles');

    await pool.query(
      'UPDATE users SET profile_image = ? WHERE id = ?',
      [imageUrl, req.user.id]
    );

    res.json({ profileImage: imageUrl, message: 'Profile image uploaded successfully' });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    console.error('[PROFILE IMAGE UPLOAD ERROR]', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// GET /users/:id/favorites
router.get('/:id/favorites', authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.id, 10) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT p.*, u.name AS seller, u.college AS college
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE w.user_id = ?`,
      [req.user.id]
    );
    connection.release();
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// POST /users/:id/favorites
router.post('/:id/favorites', authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.id, 10) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const productId = req.body.product_id || req.body.productId;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const connection = await pool.getConnection();
    // Verify product exists
    const [products] = await connection.query('SELECT id FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Product not found' });
    }

    await connection.query(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user.id, productId]
    );
    connection.release();
    res.status(201).json({ message: 'Product added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// DELETE /users/:id/favorites or /users/:id/favorites/:productId
router.delete(['/:id/favorites', '/:id/favorites/:productId'], authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.id, 10) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const productId = req.params.productId || req.body.productId || req.query.productId;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const connection = await pool.getConnection();
    await connection.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );
    connection.release();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

export default router;
export { emailTransporter };
