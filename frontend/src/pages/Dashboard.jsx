import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import TotalSummary from '../components/TotalSummary';
import { fetchExpenses, logoutUser } from '../services/api';

const Dashboard = ({ setIsAuthenticated }) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchExpenses({
        category: selectedCategory,
        sort: selectedSort
      });

      setExpenses(data);

    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to load expenses. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSort, handleLogout]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return (
    <div className="container">
      <header
        className="header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Expense Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Keep track of your spending securely
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="btn"
          style={{
            width: 'auto',
            padding: '0.6rem 1.2rem',
            background: 'var(--surface-hover)',
            fontSize: '0.9rem'
          }}
        >
          Logout
        </button>
      </header>

      {error && (
        <div
          className="error-message"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <span>{error}</span>
          <button
            className="btn"
            onClick={loadExpenses}
            style={{
              width: 'auto',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              margin: 0
            }}
          >
            Retry
          </button>
        </div>
      )}

      <ExpenseForm onExpenseAdded={loadExpenses} />

      <TotalSummary expenses={expenses} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span
            className="loading-spinner"
            style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}
          ></span>
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      )}
    </div>
  );
};

export default Dashboard;