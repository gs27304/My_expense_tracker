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
