import React from 'react';

const ExpenseList = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>No expenses found.</h3>
        <p style={{ marginTop: '0.5rem' }}>Add a new expense above to get started!</p>
      </div>
    );
  }

  // Format amount for currency display
  const formatCurrency = (amount) => {
    // Mongoose Decimal128 might serialize as an object { $numberDecimal: "..." }
    const numericValue = typeof amount === 'object' && amount?.$numberDecimal 
      ? parseFloat(amount.$numberDecimal) 
      : parseFloat(amount);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericValue || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--primary-color)' }}>Expense History</h2>
      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense._id} className="expense-item">
            <div className="expense-info">
              <h3>{expense.description}</h3>
              <div className="expense-meta">
                <span className="badge">{expense.category}</span>
                <span>{formatDate(expense.date)}</span>
              </div>
            </div>
            <div className="expense-amount">
              {formatCurrency(expense.amount)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
