// Product categories
export const PRODUCT_CATEGORIES = [
  'Books & Notes',
  'Electronics',
  'Cycles & Bikes',
  'Hostel Furniture',
  'Clothing',
  'Stationery',
  'Sports & Hobbies',
  'Lab Equipment',
  'Gadgets',
  'Bags & Luggage',
  'Kitchen Items',
  'Services'
]

// Product conditions
export const PRODUCT_CONDITIONS = [
  'Good',
  'Excellent',
  'Fair',
  'Poor'
]

// Offer statuses
export const OFFER_STATUSES = [
  'pending',
  'accepted',
  'rejected',
  'countered'
]

// Review ratings
export const REVIEW_RATINGS = [1, 2, 3, 4, 5]

// API Configuration
export const API_CONFIG = {
  PAGINATION_LIMIT_DEFAULT: 20,
  PAGINATION_LIMIT_MAX: 100,
  MESSAGE_MAX_LENGTH: 2000,
  PRODUCT_TITLE_MAX: 200,
  PRODUCT_DESCRIPTION_MAX: 1000,
  FILE_SIZE_LIMIT: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_PRODUCT: 6,
  TOKEN_EXPIRY: '7d',
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 120
  }
}

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Authorization token missing',
  INVALID_TOKEN: 'Invalid or expired token',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  INVALID_INPUT: 'Invalid input provided',
  DATABASE_ERROR: 'Database operation failed',
  FILE_UPLOAD_ERROR: 'File upload failed',
  PRODUCT_NOT_FOUND: 'Product not found',
  USER_NOT_FOUND: 'User not found',
  EMAIL_EXISTS: 'Email already registered',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SOCKET_AUTH_ERROR: 'Socket authentication failed'
}

// Success messages
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  REPORT_SUBMITTED: 'Report submitted successfully',
  OFFER_CREATED: 'Offer created successfully'
}
