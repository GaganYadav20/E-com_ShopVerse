import axios from 'axios';

// Axios instance with base URL — Vite proxy forwards /api to Spring Boot
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================
// Auth APIs
// ========================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ========================
// Product APIs
// ========================
export const productAPI = {
  getAll: (page = 0, size = 12, sortBy = 'id', direction = 'desc') =>
    api.get(`/products?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`),
  getById: (id) => api.get(`/products/${id}`),
  search: (keyword, page = 0, size = 12) =>
    api.get(`/products/search?keyword=${keyword}&page=${page}&size=${size}`),
  filter: (params) => api.get('/products/filter', { params }),
  getCategories: () => api.get('/products/categories'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ========================
// Cart APIs
// ========================
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/update/${itemId}?quantity=${quantity}`),
  remove: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

// ========================
// Order APIs
// ========================
export const orderAPI = {
  place: (shippingAddress) => api.post('/orders', { shippingAddress }),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// ========================
// Wishlist APIs
// ========================
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
};

// ========================
// Admin APIs
// ========================
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getOrders: (page = 0, size = 20) => api.get(`/admin/orders?page=${page}&size=${size}`),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
};

export default api;
