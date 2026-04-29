import api from '../api/axiosConfig';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch expenses from the backend, optionally filtered and sorted.
 * @param {Object} filters - Optional filters { category, sort }
 * @returns {Promise<Array>} List of expenses
 */
export const fetchExpenses = async (filters = {}) => {
  const { category, sort } = filters;
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (sort) params.append('sort', sort);
  
  const response = await api.get(`/api/expenses?${params.toString()}`);
  return response.data;
};

/**
 * Create a new expense. Automatically attaches a unique idempotency key.
 * @param {Object} data - Expense data { amount, category, description, date }
 * @returns {Promise<Object>} The created expense
 */
export const createExpense = async (data) => {
  // Generate a unique idempotency key for this specific request
  const idempotencyKey = uuidv4();
  
  const payload = {
    ...data,
    idempotencyKey,
  };
  
  const response = await api.post('/api/expenses', payload);
  return response.data;
};

/**
 * Register a new user
 * @param {Object} userData - { email, password }
 * @returns {Promise<Object>} User data and token
 */
export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/**
 * Login an existing user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} User data and token
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/**
 * Logout user by clearing the token
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
};
