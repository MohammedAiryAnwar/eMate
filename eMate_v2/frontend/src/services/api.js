import axios from 'axios';

const API = axios.create({
 // baseURL: 'http://localhost:5000/api',
    baseURL: 'https://emate-backend-naj2.onrender.com',

});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('emateUser'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const addProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Cart
export const addToCart = (data) => API.post('/cart/add', data);
export const getCart = () => API.get('/cart');
export const removeFromCart = (productId) => API.delete(`/cart/remove/${productId}`);
export const updateCartQty = (productId, quantity) => API.put(`/cart/update/${productId}`, { quantity });
export const clearCart = () => API.delete('/cart/clear');

// Orders
export const placeOrder = () => API.post('/orders/place');
export const getMyOrders = () => API.get('/orders/my');
export const getAllOrders = () => API.get('/orders/all');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);

export default API;
