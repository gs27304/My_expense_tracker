import React from 'react';

const TotalSummary = ({ expenses }) => {
  // Safely reduce the array, handling Mongoose Decimal128 objects
  const total = (expenses || []).reduce((sum, expense) => {
    const val = typeof expense.amount === 'object' && expense.amount?.$numberDecimal
      ? parseFloat(expense.amount.$numberDecimal)
      : parseFloat(expense.amount || 0);
    return sum + val;
  }, 0);

  // Format amount for currency display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', margin: 0 }}>Total Summary</h2>
      <div className="total-display" style={{ margin: 0 }}>
        Total: <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default TotalSummary;
