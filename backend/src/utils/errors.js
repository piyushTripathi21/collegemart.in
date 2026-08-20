// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, status = 500, field = null, data = null) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.field = field
    this.data = data
  }

  toJSON() {
    return {
      error: this.message,
      ...(this.field && { field: this.field }),
      ...(this.data && { data: this.data })
    }
  }
}

/**
 * Validation error class
 */
export class ValidationError extends APIError {
  constructor(message, field = null) {
    super(message, 422, field)
    this.name = 'ValidationError'
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed') {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization error class
 */
export class AuthorizationError extends APIError {
  constructor(message = 'Forbidden') {
    super(message, 403)
    this.name = 'AuthorizationError'
  }
}

/**
 * Not found error class
 */
export class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Database error class
 */
export class DatabaseError extends APIError {
  constructor(message = 'Database operation failed') {
    super(message, 500)
    this.name = 'DatabaseError'
  }
}

/**
 * Safe error handler - logs full error but returns safe message to user
 */
export const safeErrorHandler = (error, logger = console) => {
  // Log full error for debugging
  if (logger) {
    logger.error('[ERROR]', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.data && { data: error.data })
    })
  }

  // If it's a custom error, return its JSON representation
  if (error instanceof APIError) {
    return {
      status: error.status,
      body: error.toJSON()
    }
  }

  // Expose only safe error message for unknown errors
  return {
    status: 500,
    body: { error: 'An unexpected error occurred' }
  }
}

/**
 * Error formatter for Express middleware
 */
export const errorMiddleware = (err, req, res, next) => {
  const { status, body } = safeErrorHandler(err)
  res.status(status).json(body)
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return typeof email === 'string' && emailRegex.test(email.trim())
}

/**
 * Price validation
 */
export const validatePrice = (price) => {
  const parsed = Number(price)
  return !Number.isNaN(parsed) && parsed >= 0
}

/**
 * String length validation
 */
export const validateStringLength = (str, minLength = 0, maxLength = 255) => {
  return typeof str === 'string' && str.length >= minLength && str.length <= maxLength
}

/**
 * Rating validation (1-5)
 */
export const validateRating = (rating) => {
  const parsed = Number(rating)
  return !Number.isNaN(parsed) && parsed >= 1 && parsed <= 5
}

/**
 * Array validation
 */
export const validateArray = (arr, minLength = 0, maxLength = Infinity) => {
  return Array.isArray(arr) && arr.length >= minLength && arr.length <= maxLength
}

/**
 * Enum validation
 */
export const validateEnum = (value, allowedValues) => {
  return allowedValues.includes(value)
}

/**
 * Password validation - minimum 8 characters
 */
export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 8
}

/**
 * URL validation
 */
export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Safe string sanitization - prevents XSS and SQL injection risks
 */
export const sanitizeString = (value, maxLength = 255) => {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

/**
 * Sanitize and validate email
 */
export const sanitizeEmail = (email) => {
  const sanitized = sanitizeString(email, 200).toLowerCase()
  if (!validateEmail(sanitized)) {
    throw new ValidationError('Invalid email address', 'email')
  }
  return sanitized
}

/**
 * Sanitize and validate password
 */
export const sanitizePassword = (password) => {
  const sanitized = String(password)
  if (!validatePassword(sanitized)) {
    throw new ValidationError('Password must be at least 8 characters', 'password')
  }
  return sanitized
}

/**
 * Remove sensitive data from objects
 */
export const removeSensitiveData = (obj, keysToRemove = ['password', 'token', 'secret']) => {
  const copy = { ...obj }
  keysToRemove.forEach((key) => {
    delete copy[key]
  })
  return copy
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Parse page number safely
 */
export const parsePage = (page) => {
  const parsed = parseInt(page)
  return Math.max(1, Number.isNaN(parsed) ? 1 : parsed)
}

/**
 * Parse limit safely with bounds
 */
export const parseLimit = (limit, defaultLimit = 20, maxLimit = 100) => {
  const parsed = parseInt(limit)
  const value = Number.isNaN(parsed) ? defaultLimit : parsed
  return Math.min(Math.max(1, value), maxLimit)
}

/**
 * Safe number parsing
 */
export const parseNumber = (value, defaultValue = 0) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? defaultValue : parsed
}
