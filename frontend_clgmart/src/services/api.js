import axios from 'axios'

// Set global axios defaults for CSRF protection
axios.defaults.xsrfCookieName = 'csrfToken';
axios.defaults.xsrfHeaderName = 'X-CSRF-Token';

// Create API client instance
const api = axios.create({
  baseURL: '/api/v1',
  // baseURL: (import.meta.env.VITE_API_URL || '') + '/api/v1',
  // withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  xsrfCookieName: 'csrfToken',
  xsrfHeaderName: 'X-CSRF-Token'
})

// Add request interceptor to include auth token and normalize URLs to prevent double '/api/v1' prefixing
api.interceptors.request.use(
  (config) => {
    // Normalize URLs to prevent double prefixing
    if (config.url) {
      if (config.url.startsWith('/api/v1/')) {
        config.url = config.url.substring(7)
      } else if (config.url === '/api/v1') {
        config.url = ''
      } else if (config.url.startsWith('/api/')) {
        config.url = config.url.substring(4)
      } else if (config.url === '/api') {
        config.url = ''
      }
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config) {
      return Promise.reject(error);
    }

    // Check if this error is transient and retry-eligible
    const isNetworkError = !error.response && error.code !== 'ERR_CANCELED';
    const isTransientServerError = error.response && [502, 503, 504].includes(error.response.status);
    const isTimeout = error.code === 'ECONNABORTED';

    const shouldRetry = isNetworkError || isTransientServerError || isTimeout;

    if (shouldRetry) {
      config.retryCount = config.retryCount ?? 0;
      const maxRetries = 3;

      if (config.retryCount < maxRetries) {
        config.retryCount += 1;
        const backoffDelay = Math.pow(2, config.retryCount) * 500;
        console.warn(`[API] Request failed (${error.message}). Retrying in ${backoffDelay}ms (Attempt ${config.retryCount}/${maxRetries})...`);
        
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return api(config);
      }
    }

    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    // Return error with better structure
    const message = error.response?.data?.error || error.message || 'An error occurred'
    return Promise.reject({
      status: error.response?.status || 500,
      message,
      data: error.response?.data
    })
  }
)

// ============================================================================
// API METHODS - Organized by resource
// ============================================================================

// AUTHENTICATION
export const authAPI = {
  register: (email, password, name, college) =>
    api.post('/users/register', { email, password, name, college }),
  login: (email, password) =>
    api.post('/users/login', { email, password }),
  getCurrentUser: () =>
    api.get('/users/me')
}

// USERS
export const usersAPI = {
  getUser: (id) =>
    api.get(`/users/${id}`),
  updateProfile: (id, data) =>
    api.put(`/users/${id}`, data),
  uploadProfileImage: (id, file) => {
    const formData = new FormData()
    formData.append('profileImage', file)
    return api.post(`/users/${id}/upload-profile-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getUserProducts: (id, page = 1, limit = 20) =>
    api.get(`/users/${id}/products`, { params: { page, limit } }),
  getFavorites: (id, page = 1, limit = 20) =>
    api.get(`/users/${id}/favorites`, { params: { page, limit } }),
  addFavorite: (id, productId) =>
    api.post(`/users/${id}/favorites`, { product_id: productId }),
  removeFavorite: (id, productId) =>
    api.delete(`/users/${id}/favorites/${productId}`)
}

// PRODUCTS
export const productsAPI = {
  getAll: (page = 1, limit = 20) =>
    api.get('/products', { params: { page, limit } }),
  getById: (id) =>
    api.get(`/products/${id}`),
  getByCategory: (category, page = 1, limit = 20) =>
    api.get(`/products/category/${category}`, { params: { page, limit } }),
  getFeatured: () =>
    api.get('/products/featured/all'),
  search: (query, page = 1, limit = 20) =>
    api.get('/search', { params: { q: query, page, limit } }),
  create: (data) =>
    api.post('/products', data),
  upload: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach((file) => formData.append('images', file))
      } else {
        formData.append(key, data[key])
      }
    })
    return api.post('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  update: (id, data) =>
    api.put(`/products/${id}`, data),
  delete: (id) =>
    api.delete(`/products/${id}`),
  report: (id, reason, details) =>
    api.post(`/products/${id}/report`, { reason, details })
}

// REVIEWS
export const reviewsAPI = {
  getByProduct: (productId) =>
    api.get(`/products/${productId}/reviews`),
  create: (productId, rating, comment) =>
    api.post(`/products/${productId}/reviews`, { rating, comment })
}

// OFFERS
export const offersAPI = {
  getByProduct: (productId) =>
    api.get(`/products/${productId}/offers`),
  create: (productId, amount, message) =>
    api.post(`/products/${productId}/offers`, { amount, message }),
  update: (offerId, status, message) =>
    api.put(`/offers/${offerId}`, { status, message })
}

// MESSAGES
export const messagesAPI = {
  getByProduct: (productId, page = 1, limit = 50) =>
    api.get('/messages', { params: { product_id: productId, page, limit } }),
  getConversations: () =>
    api.get('/messages/conversations'),
  send: (productId, message, receiverId) =>
    api.post('/messages', { product_id: productId, message, receiver_id: receiverId }),
  markAsRead: (productId) =>
    api.put('/messages/read', { product_id: productId })
}

// NOTIFICATIONS
export const notificationsAPI = {
  get: () =>
    api.get('/notifications')
}

// HEALTH CHECK
export const healthAPI = {
  check: () =>
    api.get('/health')
}

export default api
