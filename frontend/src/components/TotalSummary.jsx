import React from 'react';

const TotalSummary = ({ expenses }) => {

  const parseAmount = (amount) => {
    if (typeof amount === 'object' && amount?.$numberDecimal) {
      return parseFloat(amount.$numberDecimal);
    }
    return parseFloat(amount) || 0;
  };

  const total = (expenses || []).reduce((sum, expense) => {
    return sum + parseAmount(expense.amount);
  }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div
      className="card"
      style={{
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', margin: 0 }}>
        Total Summary
      </h2>

      <div className="total-display" style={{ margin: 0 }}>
        Total: <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default TotalSummary;