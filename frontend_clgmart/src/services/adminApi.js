import axios from 'axios'

const adminApi = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api/admin',

  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  xsrfCookieName: 'csrfToken',
  xsrfHeaderName: 'X-CSRF-Token'
})

adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')

      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }

    const message = error.response?.data?.error || error.message || 'An admin API error occurred'
    return Promise.reject({
      status: error.response?.status || 500,
      message,
      data: error.response?.data
    })
  }
)

export const adminAuthAPI = {
  login: (email, password) =>
    adminApi.post('/login', { email, password }),
  getMe: () =>
    adminApi.get('/me'),
  changePassword: (currentPassword, newPassword) =>
    adminApi.put('/change-password', { currentPassword, newPassword })
}

export const adminDashboardAPI = {
  getStats: () =>
    adminApi.get('/dashboard/stats'),
  getCharts: () =>
    adminApi.get('/dashboard/charts')
}

export const adminUsersAPI = {
  getAll: (params) =>
    adminApi.get('/users', { params }),
  getById: (id) =>
    adminApi.get(`/users/${id}`),
  update: (id, data) =>
    adminApi.put(`/users/${id}`, data),
  ban: (id, reason, banType = 'permanent', expiresAt = null) =>
    adminApi.post(`/users/${id}/ban`, { reason, banType, expiresAt }),
  unban: (id) =>
    adminApi.post(`/users/${id}/unban`),
  updateCoins: (id, amount, action = 'add') =>
    adminApi.put(`/users/${id}/coins`, { amount, action })
}

export const adminProductsAPI = {
  getAll: (params) =>
    adminApi.get('/products', { params }),
  getById: (id) =>
    adminApi.get(`/products/${id}`),
  update: (id, data) =>
    adminApi.put(`/products/${id}`, data),
  delete: (id) =>
    adminApi.delete(`/products/${id}`),
  toggleFeatured: (id) =>
    adminApi.put(`/products/${id}/featured`),
  toggleHide: (id, hidden, reason = '') =>
    adminApi.put(`/products/${id}/hide`, { hidden, reason })
}

export const adminCategoriesAPI = {
  getAll: () =>
    adminApi.get('/categories'),
  create: (data) =>
    adminApi.post('/categories', data),
  update: (id, data) =>
    adminApi.put(`/categories/${id}`, data),
  delete: (id) =>
    adminApi.delete(`/categories/${id}`)
}

export const adminReportsAPI = {
  getAll: (params) =>
    adminApi.get('/reports', { params }),
  resolve: (id, status) =>
    adminApi.put(`/reports/${id}`, { status }) // status: 'resolved' or 'dismissed'
}

export const adminTransactionsAPI = {
  getAll: (params) =>
    adminApi.get('/transactions', { params })
}

export const adminOffersAPI = {
  getAll: (params) =>
    adminApi.get('/offers', { params })
}

export const adminMessagesAPI = {
  getByProduct: (productId) =>
    adminApi.get(`/messages/${productId}`),
  delete: (id) =>
    adminApi.delete(`/messages/${id}`)
}

export const adminReviewsAPI = {
  getAll: (params) =>
    adminApi.get('/reviews', { params }),
  delete: (id) =>
    adminApi.delete(`/reviews/${id}`)
}

export const adminCoinsAPI = {
  getStats: () =>
    adminApi.get('/coins/stats')
}

export const adminCollegesAPI = {
  getAll: () =>
    adminApi.get('/colleges')
}

export const adminAnnouncementsAPI = {
  getAll: () =>
    adminApi.get('/announcements'),
  create: (data) =>
    adminApi.post('/announcements', data),
  update: (id, data) =>
    adminApi.put(`/announcements/${id}`, data),
  sendEmail: (id) =>
    adminApi.post(`/announcements/${id}/send-email`)
}

export const adminSettingsAPI = {
  getAll: () =>
    adminApi.get('/settings'),
  update: (settings) =>
    adminApi.put('/settings', settings)
}

export const adminAccessAPI = {
  getAdmins: () =>
    adminApi.get('/admins'),
  createAdmin: (data) =>
    adminApi.post('/admins', data),
  updateAdmin: (id, data) =>
    adminApi.put(`/admins/${id}`, data),
  getLogs: (params) =>
    adminApi.get('/logs', { params })
}

export const adminAnalyticsAPI = {
  getUsers: (days = 30) =>
    adminApi.get('/analytics/users', { params: { days } }),
  getProducts: (days = 30) =>
    adminApi.get('/analytics/products', { params: { days } }),
  getCategories: () =>
    adminApi.get('/analytics/categories'),
  getRevenue: (days = 30) =>
    adminApi.get('/analytics/revenue', { params: { days } }),
  exportCSV: async () => {

    const adminToken = localStorage.getItem('adminToken')
    const response = await axios({
      url: (import.meta.env.VITE_API_URL || '') + '/api/admin/analytics/export',
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `collegemart_analytics_report_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export default adminApi
