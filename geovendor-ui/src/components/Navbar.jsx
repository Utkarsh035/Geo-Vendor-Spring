import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';

export default function Navbar() {
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
    <nav className="navbar" id="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={close}>
          <i className="fas fa-map-marker-alt"></i>
          <span>Geo<strong>Vendor</strong></span>
        </Link>
        <div className={`nav-links${mobileOpen ? ' open' : ''}`} id="navLinks">
          <Link to="/" className="nav-link" onClick={close}>Home</Link>
          <Link to="/contact" className="nav-link" onClick={close}>Contact</Link>

          {!currentUser && (
            <>
              <Link to="/user-login" className="nav-link" onClick={close}>User Login</Link>
              <Link to="/vendor-login" className="nav-link" onClick={close}>Vendor Login</Link>
              <Link to="/admin-login" className="nav-link" onClick={close}>Admin</Link>
            </>
          )}

          {currentUser?.role === 'user' && (
            <Link to="/user-dashboard" className="nav-link" onClick={close}>Dashboard</Link>
          )}
          {currentUser?.role === 'vendor' && (
            <Link to="/vendor-dashboard" className="nav-link" onClick={close}>Dashboard</Link>
          )}
          {currentUser?.role === 'admin' && (
            <Link to="/admin-dashboard" className="nav-link" onClick={close}>Dashboard</Link>
          )}

          {currentUser && (
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </a>
          )}
        </div>
        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </nav>
  );
}
