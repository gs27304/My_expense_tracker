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

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
const getExpenses = async (req, res) => {
  try {
    const { category, sort } = req.query;

    // Filtering
    let query = {};
    if (category) {
      query.category = category;
    }

    // Sorting
    let sortObj = { date: -1 }; // Default to newest first
    if (sort === 'date_asc') {
      sortObj = { date: 1 };
    } else if (sort === 'date_desc') {
      sortObj = { date: -1 };
    }

    const expenses = await Expense.find(query).sort(sortObj);
    
    // Map the documents to include a specific `created_at` field as requested
    const formattedExpenses = expenses.map(expense => {
      const expenseObj = expense.toObject();
      return {
        ...expenseObj,
        created_at: expense.createdAt
      };
    });

    res.status(200).json(formattedExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses
};
