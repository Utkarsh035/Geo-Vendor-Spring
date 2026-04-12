import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, TrendingUp, BarChart3, Globe } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

export default function PartnerLogin() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await api.loginPartner(email, password);
    if (res.success) {
      login(res.data);
      showToast('Welcome back!');
      navigate('/partner-dashboard');
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <section className="page active">
      <div className="auth-split">
        <div className="auth-brand-panel vendor-panel">
          <div className="auth-brand-glow"></div>
          <motion.div className="auth-brand-content" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="auth-brand-icon"><Store size={32} /></div>
            <h2>Grow Your Business</h2>
            <p>Put your business on the map. Let thousands of customers discover you through GPS-powered search.</p>
            <div className="auth-brand-features">
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><Globe size={16} /></div><span>Get discovered by nearby customers</span></div>
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><TrendingUp size={16} /></div><span>Live location broadcasting</span></div>
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><BarChart3 size={16} /></div><span>Build your online reputation</span></div>
            </div>
          </motion.div>
        </div>

        <div className="auth-form-panel">
          <motion.div className="auth-form-inner" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <div className="auth-form-header">
              <h2>Partner sign in</h2>
              <p>Access your business dashboard</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label><Mail size={16} /> Email</label><input type="email" name="email" required placeholder="your@email.com" /></div>
              <div className="form-group"><label><Lock size={16} /> Password</label><input type="password" name="password" required placeholder="••••••••" /></div>
              <button type="submit" className="btn btn-primary btn-block auth-submit-vendor">Sign In</button>
            </form>
            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
            <p className="auth-form-footer">Don't have an account? <Link to="/partner-register">Register here</Link></p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
