import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Sparkles, LogOut } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            <Users size={24} className="text-primary" />
            AI Analytics
          </h2>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/ai-recommendation" className={`nav-link ${location.pathname === '/ai-recommendation' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Sparkles size={16} />
            AI Insights
          </Link>
          <button onClick={onLogout} className="btn" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
