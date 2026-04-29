require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite development server
    process.env.FRONTEND_URL // Vercel deployment URL
  ].filter(Boolean), // Filters out undefined if not set in .env yet
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/expenses', require('./routes/expenseRoutes'));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
