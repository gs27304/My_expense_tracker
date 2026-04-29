# Personal Expense Tracker

A high-quality, full-stack Personal Expense Tracker built using the MERN stack (MongoDB, Express, React, Node.js). Designed to operate reliably under real-world conditions like unstable networks and page refreshes.

## Features
- **Expense Management**: Record expenses with amount, category, description, and date.
- **Data Visualization**: Clean and responsive list/table of expenses.
- **Dynamic Controls**: Filter by category and sort by date.
- **Live Calculations**: Instantly see totals based on currently visible expenses.
- **Resilience**: Features idempotency mechanisms on the backend to prevent duplicate entries from retries or page refreshes.

## Project Structure
This is a monorepo containing both the frontend and backend applications:
- `/frontend`: React application built with Vite and premium Vanilla CSS styling.
- `/backend`: Node.js/Express server with a MongoDB database connection.

## Local Setup Instructions

1. **Clone the repository** and navigate to the project root.
2. **Setup Backend**:
   - `cd backend`
   - Create a `.env` file containing your `MONGO_URI`.
   - `npm install`
   - `npm start` (Runs on `http://localhost:5000`)
3. **Setup Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev` (Runs on `http://localhost:5173`)

## Production Deployment

This application is configured for a multi-platform deployment (Railway + Vercel).

### Backend (Railway)
1. Push your repository to GitHub.
2. Go to [Railway.app](https://railway.app/) and create a new project from your GitHub repository.
3. Configure the service to use the `/backend` directory.
4. Add the following **Environment Variables** in the Railway dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `FRONTEND_URL`: Your Vercel frontend domain (e.g., `https://your-expense-tracker.vercel.app`).

### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Set the Framework Preset to **Vite**.
3. Set the **Root Directory** to `frontend`.
4. Add the following **Environment Variable** in the Vercel dashboard:
   - `VITE_API_URL`: Your Railway backend domain (e.g., `https://backend-production.up.railway.app`).
5. Deploy! Vercel will automatically read the `vercel.json` included in this repo to handle SPA routing.
