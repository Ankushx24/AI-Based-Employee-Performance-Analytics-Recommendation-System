import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-6">
          <Users size={48} className="text-primary mb-2" style={{ margin: '0 auto' }} />
          <h2>Welcome Back</h2>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Login to your HR Dashboard</p>
        </div>
        
        {error && <div className="badge mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', display: 'block', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        <p className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" className="text-primary">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
