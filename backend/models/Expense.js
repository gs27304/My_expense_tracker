const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, 'Please add an amount'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now,
  },
  idempotencyKey: {
    type: String,
    required: [true, 'Idempotency key is required'],
    unique: true,
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);
