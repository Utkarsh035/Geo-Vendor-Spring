import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { MapPin, Home, Mail, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export default function UserNavbar() {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully');
    navigate('/');
    setMobileOpen(false);
  };

  const close = () => setMobileOpen(false);

  return (
    <nav className="navbar user-navbar" id="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={close}>
          <span className="logo-icon"><MapPin size={18} /></span>
          <span>Geo<strong>Vendor</strong></span>
        </Link>
        <div className={`nav-links${mobileOpen ? ' open' : ''}`} id="navLinks">
          <Link to="/" className="nav-link" onClick={close}><Home size={16} /> Home</Link>
          <Link to="/contact" className="nav-link" onClick={close}><Mail size={16} /> Contact</Link>

          {!currentUser && (
            <>
              <Link to="/user-login" className="nav-link" onClick={close}><User size={16} /> Login</Link>
              <Link to="/user-register" className="nav-link btn-signup" onClick={close}>Sign Up</Link>
            </>
          )}

          {currentUser?.role === 'user' && (
            <Link to="/user-dashboard" className="nav-link" onClick={close}><LayoutDashboard size={16} /> Dashboard</Link>
          )}

          {currentUser && (
            <a href="#" className="nav-link logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <LogOut size={16} /> Logout
            </a>
          )}
        </div>
        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}
