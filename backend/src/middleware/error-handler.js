import crypto from 'crypto';

export const requestIdMiddleware = (req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[REQUEST] [${req.id}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
};

export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let responseMessage = err.message;

  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 400;
    responseMessage = 'File size too large. Maximum allowed size is 5MB.';
  }

  console.error(`[ERROR] [${req.id || 'N/A'}] STATUS=${status} MESSAGE="${err.message}"`, err.stack);

  if (status === 500) {
    responseMessage = 'An unexpected error occurred. Please contact support.';
  }

  res.status(status).json({
    error: responseMessage,
    requestId: req.id
  });
};
