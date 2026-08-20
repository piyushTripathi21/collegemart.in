import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in environment variables. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
}

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const [blacklisted] = await pool.query('SELECT token FROM token_blacklist WHERE token = ?', [token]);
    if (blacklisted.length > 0) {
      return res.status(401).json({ error: 'Token has been invalidated (logged out)' });
    }
  } catch (err) {
    console.error('[AUTH ERROR] Token blacklist check failed', err);
    return res.status(500).json({ error: 'Internal validation failed' });
  }

  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    try {
      const [rows] = await pool.query('SELECT is_banned FROM users WHERE id = ?', [payload.id]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'User account not found' });
      }
      if (rows[0].is_banned) {
        return res.status(403).json({ error: 'Your account has been banned. Access denied.' });
      }

      req.user = payload;
      next();
    } catch (dbErr) {
      console.error('[AUTH ERROR] User ban check failed', dbErr);
      return res.status(500).json({ error: 'Internal validation failed' });
    }
  });
};

export const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
      if (!err) {
        try {
          const [rows] = await pool.query('SELECT is_banned FROM users WHERE id = ?', [payload.id]);
          if (rows.length > 0 && !rows[0].is_banned) {
            req.user = payload;
          }
        } catch (dbErr) {
          // Fail silently for optional authentication
        }
      }
      next();
    });
  } else {
    next();
  }
};
export { JWT_SECRET };
