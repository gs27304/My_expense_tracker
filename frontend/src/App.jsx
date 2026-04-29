import React, { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import TotalSummary from './components/TotalSummary';
import { fetchExpenses } from './services/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses({ category: selectedCategory, sort: selectedSort });
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSort]);

  // Refetch when dependencies (category or sort) change
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return (
    <div className="container">
      <header className="header">
        <h1>Expense Tracker</h1>
        <p>Keep track of your spending with accuracy</p>
      </header>

      {error && (
        <div className="error-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span>{error}</span>
          <button 
            className="btn" 
            onClick={() => loadExpenses()} 
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', margin: 0 }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Passing loadExpenses to refresh the list automatically when a new expense is added */}
      <ExpenseForm onExpenseAdded={loadExpenses} />
      
      <TotalSummary expenses={expenses} />

      {loading && expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="loading-spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></span>
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
}

export default App;
