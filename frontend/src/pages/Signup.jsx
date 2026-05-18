import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-6">
          <Users size={48} className="text-primary mb-2" style={{ margin: '0 auto' }} />
          <h2>Create Account</h2>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Join the HR Analytics platform</p>
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign Up</button>
        </form>
        <p className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
