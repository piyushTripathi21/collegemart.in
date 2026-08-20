import crypto from 'crypto';

export const csrfProtection = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );

  const csrfCookie = cookies['csrfToken'];
  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ error: 'CSRF validation failed: Token mismatch or missing.' });
  }

  next();
};

export const generateCsrfToken = (req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const parts = c.trim().split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
  );

  let csrfToken = cookies['csrfToken'];
  if (!csrfToken) {
    csrfToken = crypto.randomBytes(24).toString('hex');
    res.cookie('csrfToken', csrfToken, {
      path: '/',
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false // Must be readable by client JS to append to headers
    });
  }

  next();
};

export const rotateCsrfToken = (req, res) => {
  const newToken = crypto.randomBytes(24).toString('hex');
  res.cookie('csrfToken', newToken, {
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false
  });
  return newToken;
};
