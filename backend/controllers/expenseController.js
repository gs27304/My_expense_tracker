const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Public
const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date, idempotencyKey } = req.body;

    if (!amount || !category || !description || !idempotencyKey) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Idempotency check: if a request with this key already succeeded, return the stored result
    const existingExpense = await Expense.findOne({ idempotencyKey });
    if (existingExpense) {
      return res.status(200).json(existingExpense);
    }

    // Parse amount to Decimal128 to maintain financial accuracy
    const decimalAmount = mongoose.Types.Decimal128.fromString(amount.toString());

    const expense = await Expense.create({
      amount: decimalAmount,
      category,
      description,
      date: date || Date.now(),
      idempotencyKey
    });

    res.status(201).json(expense);
  } catch (error) {
    // Handle potential race conditions where the unique constraint is hit simultaneously
    if (error.code === 11000 && error.keyPattern && error.keyPattern.idempotencyKey) {
      const existingExpense = await Expense.findOne({ idempotencyKey: req.body.idempotencyKey });
      if (existingExpense) {
        return res.status(200).json(existingExpense);
      }
    }
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createExpense
};
