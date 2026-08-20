import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    return req.user?.id ? `user_${req.user.id}` : ipKeyGenerator(req, res);
  }
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: 'Too many password reset requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    const email = req.body?.email ? String(req.body.email).toLowerCase().trim() : '';
    return email ? `forgot_pwd_${email}` : `forgot_pwd_ip_${ipKeyGenerator(req, res)}`;
  }
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    const email = req.body?.email ? String(req.body.email).toLowerCase().trim() : '';
    return email ? `login_${email}` : `login_ip_${ipKeyGenerator(req, res)}`;
  }
});

export const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 20,
  message: { error: 'Too many messages sent, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    return req.user?.id ? `msg_user_${req.user.id}` : `msg_ip_${ipKeyGenerator(req, res)}`;
  }
});

// Protect registry, verification, and coin creation endpoints
export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5,
  message: { error: 'Too many attempts on this sensitive action, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    return req.user?.id ? `sensitive_user_${req.user.id}` : `sensitive_ip_${ipKeyGenerator(req, res)}`;
  }
});

export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many token refresh requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    return req.user?.id ? `refresh_user_${req.user.id}` : `refresh_ip_${ipKeyGenerator(req, res)}`;
  }
});

export const productListLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: { error: 'Too many requests for product listings, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    return req.user?.id ? `prod_list_user_${req.user.id}` : `prod_list_ip_${ipKeyGenerator(req, res)}`;
  }
});

export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { error: 'Too many search requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    return req.user?.id ? `search_user_${req.user.id}` : `search_ip_${ipKeyGenerator(req, res)}`;
  }
});

export const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many review requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { ip: false },
  keyGenerator: (req, res) => {
    return req.user?.id ? `review_user_${req.user.id}` : `review_ip_${ipKeyGenerator(req, res)}`;
  }
});
