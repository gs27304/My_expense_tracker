
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // 🔥 Sync auth state across tabs / refresh
  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', syncAuth);

    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <Router>
      <Routes>

        <Route 
          path="/login" 
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />

        <Route 
          path="/register" 
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Register setIsAuthenticated={setIsAuthenticated} />
          } 
        />

        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;