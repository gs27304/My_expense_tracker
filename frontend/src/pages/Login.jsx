import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };

      await loginUser(payload);

      setIsAuthenticated(true);
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '10vh' }}>
      <div className="card">
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: 'var(--primary-color)',
            fontSize: '2rem'
          }}
        >
          Welcome Back
        </h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? <span className="loading-spinner"></span> : 'Log In'}
          </button>
        </form>

        <p
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--primary-color)',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;