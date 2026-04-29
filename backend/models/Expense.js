const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Please add an amount'],
      validate: {
        validator: function (value) {
          return parseFloat(value.toString()) >= 0;
        },
        message: 'Amount must be a positive number',
      },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);