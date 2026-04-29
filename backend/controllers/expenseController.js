const Expense = require('../models/Expense');
const mongoose = require('mongoose');

const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    const idempotencyKey =
      req.headers['idempotency-key'] || req.body.idempotencyKey;

    if (amount === undefined || !category || !date || !idempotencyKey) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingExpense = await Expense.findOne({ idempotencyKey });
    if (existingExpense) {
      return res.status(200).json(existingExpense);
    }

    const decimalAmount = mongoose.Types.Decimal128.fromString(
      amount.toString()
    );

    const expense = await Expense.create({
      user: req.user.id,
      amount: decimalAmount,
      category,
      description,
      date,
      idempotencyKey
    });

    res.status(201).json(expense);

  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.idempotencyKey
    ) {
      const existingExpense = await Expense.findOne({
        idempotencyKey:
          req.headers['idempotency-key'] || req.body.idempotencyKey
      });
      if (existingExpense) {
        return res.status(200).json(existingExpense);
      }
    }

    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { category, sort } = req.query;

    let query = { user: req.user.id };

    if (category) {
      query.category = category;
    }

    let sortObj = { date: -1 };

    if (sort === 'date_asc') {
      sortObj = { date: 1 };
    }

    const expenses = await Expense.find(query).sort(sortObj);

    const formattedExpenses = expenses.map((expense) => {
      const expenseObj = expense.toObject();
      return {
        ...expenseObj,
        created_at: expense.createdAt
      };
    });

    res.status(200).json(formattedExpenses);

  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createExpense,
  getExpenses
};