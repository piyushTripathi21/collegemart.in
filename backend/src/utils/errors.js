

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

export class ValidationError extends APIError {
  constructor(message, field = null) {
    super(message, 422, field)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed') {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends APIError {
  constructor(message = 'Forbidden') {
    super(message, 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404)
    this.name = 'NotFoundError'
  }
}

export class DatabaseError extends APIError {
  constructor(message = 'Database operation failed') {
    super(message, 500)
    this.name = 'DatabaseError'
  }
}

export const safeErrorHandler = (error, logger = console) => {

  if (logger) {
    logger.error('[ERROR]', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.data && { data: error.data })
    })
  }

  if (error instanceof APIError) {
    return {
      status: error.status,
      body: error.toJSON()
    }
  }

  return {
    status: 500,
    body: { error: 'An unexpected error occurred' }
  }
}

export const errorMiddleware = (err, req, res, next) => {
  const { status, body } = safeErrorHandler(err)
  res.status(status).json(body)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return typeof email === 'string' && emailRegex.test(email.trim())
}

export const validatePrice = (price) => {
  const parsed = Number(price)
  return !Number.isNaN(parsed) && parsed >= 0
}

export const validateStringLength = (str, minLength = 0, maxLength = 255) => {
  return typeof str === 'string' && str.length >= minLength && str.length <= maxLength
}

export const validateRating = (rating) => {
  const parsed = Number(rating)
  return !Number.isNaN(parsed) && parsed >= 1 && parsed <= 5
}

export const validateArray = (arr, minLength = 0, maxLength = Infinity) => {
  return Array.isArray(arr) && arr.length >= minLength && arr.length <= maxLength
}

export const validateEnum = (value, allowedValues) => {
  return allowedValues.includes(value)
}

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 8
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export const sanitizeString = (value, maxLength = 255) => {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

export const sanitizeEmail = (email) => {
  const sanitized = sanitizeString(email, 200).toLowerCase()
  if (!validateEmail(sanitized)) {
    throw new ValidationError('Invalid email address', 'email')
  }
  return sanitized
}

export const sanitizePassword = (password) => {
  const sanitized = String(password)
  if (!validatePassword(sanitized)) {
    throw new ValidationError('Password must be at least 8 characters', 'password')
  }
  return sanitized
}

export const removeSensitiveData = (obj, keysToRemove = ['password', 'token', 'secret']) => {
  const copy = { ...obj }
  keysToRemove.forEach((key) => {
    delete copy[key]
  })
  return copy
}

export const parsePage = (page) => {
  const parsed = parseInt(page)
  return Math.max(1, Number.isNaN(parsed) ? 1 : parsed)
}

export const parseLimit = (limit, defaultLimit = 20, maxLimit = 100) => {
  const parsed = parseInt(limit)
  const value = Number.isNaN(parsed) ? defaultLimit : parsed
  return Math.min(Math.max(1, value), maxLimit)
}

export const parseNumber = (value, defaultValue = 0) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? defaultValue : parsed
}
