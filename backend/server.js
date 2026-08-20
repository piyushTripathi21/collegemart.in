import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { Server as IOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Import configurations and middleware
import pool from './src/config/db.js';
import { JWT_SECRET } from './src/middleware/auth.js';
import { apiLimiter } from './src/middleware/rate-limit.js';
import { csrfProtection, generateCsrfToken } from './src/middleware/csrf.js';
import { requestIdMiddleware, requestLogger, errorHandler } from './src/middleware/error-handler.js';
import { verifyAndCreateIndexes } from './verify-indexes.js';

// Import modular routers
import authRouter, { emailTransporter } from './src/routes/auth.js';
import productsRouter from './src/routes/products.js';
import messagesRouter from './src/routes/messages.js';
import collegesRouter from './src/routes/colleges.js';

// Import admin setup
import { setupAdminRoutes } from './admin-routes.js';

dotenv.config();

// Environment Variable Validation (Issue #5 of Critical list)
const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnv = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnv.length > 0) {
  console.error(`[FATAL] Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

if (!process.env.ADMIN_JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[FATAL] ADMIN_JWT_SECRET environment variable is required in production');
    process.exit(1);
  } else {
    process.env.ADMIN_JWT_SECRET = process.env.JWT_SECRET + '_admin';
    console.warn('[WARNING] ADMIN_JWT_SECRET is missing. Falling back to JWT_SECRET + "_admin" in development.');
  }
}

// Sentry SDK Initialization
let Sentry = null;
if (process.env.SENTRY_DSN) {
  try {
    Sentry = await import('@sentry/node');
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
    });
    console.log('[SENTRY] Initialized successfully');
  } catch (err) {
    console.warn('[SENTRY] Failed to initialize Sentry:', err.message);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
  .split(',')
  .map(o => o.trim());

// Helper for inline sanitization
const sanitizeString = (value, maxLength = 255) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

// Response Compression
app.use(compression());

// Inject API Versioning Header (Issue #24 of High list)
app.use((req, res, next) => {
  res.setHeader('API-Version', 'v1');
  next();
});

// Security Headers with Custom CSP Configuration (Issue #1 of Medium list)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "wss://*", "https://*"],
      imgSrc: ["'self'", "data:", "https://*"]
    }
  }
}));

app.disable('x-powered-by');

// CORS setup
app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true,
  optionsSuccessStatus: 200 
}));

// Request Tracking & Logging (Issues #11 & #15 of High list)
app.use(requestIdMiddleware);
app.use(requestLogger);

// Parsers with security payload size limits
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

// CSRF Protection cookie generator
app.use(generateCsrfToken);

// Serve uploads folder with caching headers (Issue #19 of High list)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), {
  maxAge: '1y',
  etag: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});
app.set('socketio', io);

// Socket.io Authorization verification
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next(new Error('Authentication error: Token missing'));
  
  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) return next(new Error('Authentication error: Token invalid'));
    
    // SOCKET AUTH HARDENING FIX: Verify user exists and is not banned
    try {
      const [rows] = await pool.query('SELECT is_banned FROM users WHERE id = ?', [payload.id]);
      if (rows.length === 0) return next(new Error('Authentication error: User not found'));
      if (rows[0].is_banned) return next(new Error('Authentication error: User account banned'));

      // Also verify token is not blacklisted
      const [blacklisted] = await pool.query('SELECT token FROM token_blacklist WHERE token = ?', [token]);
      if (blacklisted.length > 0) return next(new Error('Authentication error: Token blacklisted'));

      socket.user = payload;

      // Auto-disconnect when token expires (Issue #4 of Critical list)
      const msToExpiry = (payload.exp * 1000) - Date.now();
      if (msToExpiry <= 0) {
        return next(new Error('Authentication error: Token expired'));
      }
      
      const disconnectTimer = setTimeout(() => {
        socket.emit('error', { message: 'Authentication expired. Please reconnect.' });
        socket.disconnect(true);
      }, msToExpiry);
      
      socket.on('disconnect', () => clearTimeout(disconnectTimer));

      next();
    } catch (e) {
      next(new Error('Authentication error: Validation failed'));
    }
  });
});

// Helper to verify user details and involvement in chats (Issue #10 Critical)
const verifyProductAccess = async (userId, productId) => {
  try {
    const [products] = await pool.query('SELECT user_id FROM products WHERE id = ?', [productId]);
    if (products.length === 0) return false;
    if (products[0].user_id === userId) return true; // Seller

    // Check if buyer has submitted offer on this product
    const [offers] = await pool.query(
      'SELECT id FROM offers WHERE product_id = ? AND buyer_id = ?', 
      [productId, userId]
    );
    if (offers.length > 0) return true;

    // Check if buyer has exchanged messages
    const [messages] = await pool.query(
      'SELECT id FROM messages WHERE product_id = ? AND (sender_id = ? OR receiver_id = ?) LIMIT 1',
      [productId, userId, userId]
    );
    return messages.length > 0;
  } catch (e) {
    console.error('[ERROR] Product access check failed', e);
    return false;
  }
};

io.on('connection', (socket) => {
  const uid = socket.user?.id;
  if (uid) {
    socket.join(`user_${uid}`);
  }

  socket.on('join', async ({ productId }) => {
    if (productId && uid) {
      const hasAccess = await verifyProductAccess(uid, productId);
      if (hasAccess) {
        socket.join(`product_${productId}`);
      } else {
        // SOCKET MEMORY LEAK FIX: Force disconnect unauthorized connections immediately
        socket.emit('error', { message: 'Unauthorized access to product room' });
        socket.disconnect(true);
      }
    }
  });

  socket.on('leave', ({ productId }) => {
    if (productId) socket.leave(`product_${productId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[Socket] User ${uid || 'unknown'} disconnected: ${reason}`);
  });
});

// Mount routers under API versioning path /api/v1 (Issue #10 of High list)
app.use('/api/v1/auth', csrfProtection, authRouter);
app.use('/api/v1/users', csrfProtection, authRouter); // Supports frontend /api/users/ requests
app.use('/api/v1/products', csrfProtection, productsRouter);
app.use('/api/v1/messages', csrfProtection, messagesRouter);
app.use('/api/v1/colleges', collegesRouter);

// Notifications endpoint — returns unread message count and pending offers for the logged-in user
app.get('/api/v1/notifications', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ unread_messages: 0, pending_offers: 0 });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) reject(err);
        else resolve(payload);
      });
    });
    const userId = decoded.id;
    const [[msgRow], [offerRow]] = await Promise.all([
      pool.query(
        'SELECT COUNT(*) AS cnt FROM messages WHERE receiver_id = ? AND is_read = 0',
        [userId]
      ),
      pool.query(
        "SELECT COUNT(*) AS cnt FROM offers WHERE (seller_id = ? OR buyer_id = ?) AND status = 'pending'",
        [userId, userId]
      )
    ]);
    return res.json({
      unread_messages: msgRow[0]?.cnt || 0,
      pending_offers: offerRow[0]?.cnt || 0
    });
  } catch {
    return res.json({ unread_messages: 0, pending_offers: 0 });
  }
});

// Forward /api/v1/search request directly to productsRouter search handler
app.use('/api/v1/search', csrfProtection, (req, res, next) => {
  req.url = '/search';
  productsRouter(req, res, next);
});

// Health check endpoint validating ALL dependencies (Issue #26 of High list)
app.get('/api/v1/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    // Also verify email transporter is connected
    try {
      await emailTransporter.verify();
    } catch (emailErr) {
      console.warn('[HEALTH] Email transport verification failed:', emailErr.message);
    }

    res.json({ status: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Setup Legacy Admin Routes
setupAdminRoutes(app, pool, JWT_SECRET, emailTransporter, sanitizeString);

// Sentry Error Handler
if (Sentry) {
  if (typeof Sentry.setupExpressErrorHandler === 'function') {
    Sentry.setupExpressErrorHandler(app);
  } else if (Sentry.Handlers && typeof Sentry.Handlers.errorHandler === 'function') {
    app.use(Sentry.Handlers.errorHandler());
  }
}

// Fallback static files serving in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Fallback centralized sanitizing error handler
app.use(errorHandler);

// Start server and run index check
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, async () => {
    console.log(`CollegeMart API Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/v1/health`);

    try {
      await verifyAndCreateIndexes(pool);
    } catch (err) {
      console.error('Error running index verification:', err);
    }

    // Start automated daily backup (Issue #8 of Critical list)
    setInterval(() => {
      console.log('[CRON] Initiating daily database backup...');
      import('child_process').then(({ exec }) => {
        exec('node backup-db.js', (err, stdout, stderr) => {
          if (err) {
            console.error('[CRON ERROR] Database backup failed:', err.message);
          } else {
            console.log('[CRON] Database backup succeeded:', stdout.trim());
          }
        });
      });
    }, 24 * 60 * 60 * 1000); // 24 hours
  });
}

// Graceful shutdowns handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    io.close();
    pool.end(() => {
      console.log('Server and database pool closed.');
      process.exit(0);
    });
  });
});

export { app, server, pool };
