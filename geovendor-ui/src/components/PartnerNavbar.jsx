import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { Store, Home, LogOut, Menu, X, LayoutDashboard, Briefcase } from 'lucide-react';

export default function PartnerNavbar() {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully');
    navigate('/partner');
    setMobileOpen(false);
  };

  const close = () => setMobileOpen(false);

  return (
    <nav className="navbar partner-navbar" id="navbar">
      <div className="nav-container">
        <Link to="/partner" className="nav-logo" onClick={close}>
          <span className="logo-icon"><Store size={18} /></span>
          <span>GeoVendor <strong>Partner</strong></span>
        </Link>
        <div className={`nav-links${mobileOpen ? ' open' : ''}`} id="navLinks">
          <Link to="/partner" className="nav-link" onClick={close}><Home size={16} /> Partner Home</Link>
          
          {!currentUser && (
            <>
              <Link to="/partner-login" className="nav-link" onClick={close}><Briefcase size={16} /> Login</Link>
              <Link to="/partner-register" className="nav-link btn-signup partner-btn" onClick={close}>Join as Partner</Link>
            </>
          )}

          {currentUser?.role === 'vendor' && (
            <Link to="/partner-dashboard" className="nav-link" onClick={close}><LayoutDashboard size={16} /> Dashboard</Link>
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
