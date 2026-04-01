import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle, Mail, Lock, MapPin, Star, Navigation } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

export default function UserLogin() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await api.loginUser(email, password);
    if (res.success) {
      login(res.data);
      showToast('Welcome back!');
      navigate('/user-dashboard');
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <section className="page active">
      <div className="auth-split">
        <div className="auth-brand-panel user-panel">
          <div className="auth-brand-glow"></div>
          <motion.div 
            className="auth-brand-content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="auth-brand-icon"><UserCircle size={32} /></div>
            <h2>Discover Vendors Near You</h2>
            <p>Access GPS-powered business discovery with real-time tracking and verified reviews.</p>
            <div className="auth-brand-features">
              <div className="auth-brand-feature">
                <div className="auth-brand-feature-icon"><MapPin size={16} /></div>
                <span>Find businesses within 5 km radius</span>
              </div>
              <div className="auth-brand-feature">
                <div className="auth-brand-feature-icon"><Navigation size={16} /></div>
                <span>Live GPS tracking with route navigation</span>
              </div>
              <div className="auth-brand-feature">
                <div className="auth-brand-feature-icon"><Star size={16} /></div>
                <span>Read verified ratings and reviews</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="auth-form-panel">
          <motion.div
            className="auth-form-inner"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="auth-form-header">
              <h2>Welcome back</h2>
              <p>Enter your credentials to access your account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><Mail size={16} /> Email</label>
                <input type="email" name="email" required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label><Lock size={16} /> Password</label>
                <input type="password" name="password" required placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-primary btn-block auth-submit-user">Sign In</button>
            </form>
            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
            <p className="auth-form-footer">Don't have an account? <Link to="/user-register">Create one</Link></p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
