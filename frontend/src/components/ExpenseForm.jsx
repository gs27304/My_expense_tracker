import React, { useState } from 'react';
import { createExpense } from '../services/api';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food', 'Transportation', 'Housing', 'Utilities',
    'Entertainment', 'Healthcare', 'Shopping', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateIdempotencyKey = () => {
    return Date.now() + "-" + Math.random().toString(36).substring(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');

    if (!formData.amount || !formData.category || !formData.description || !formData.date) {
      setError('Please fill in all fields.');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        idempotencyKey: generateIdempotencyKey()
      };

      await createExpense(payload);

      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });

      if (onExpenseAdded) {
        onExpenseAdded();
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--primary-color)' }}>
        Add New Expense
      </h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Amount ($)</label>
          <input
            type="number"
            name="amount"
            className="form-control"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0.01"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Grocery shopping"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <span className="loading-spinner"></span> : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;