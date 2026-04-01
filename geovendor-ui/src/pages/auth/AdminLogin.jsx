import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Database, Users, Settings } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await api.loginAdmin(email, password);
    if (res.success) {
      login(res.data);
      showToast('Admin access granted');
      navigate('/admin-dashboard');
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <section className="page active">
      <div className="auth-split">
        <div className="auth-brand-panel admin-panel">
          <div className="auth-brand-glow"></div>
          <motion.div className="auth-brand-content" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="auth-brand-icon"><ShieldCheck size={32} /></div>
            <h2>Admin Control Center</h2>
            <p>Manage users, vendors, feedback, and platform analytics from one powerful dashboard.</p>
            <div className="auth-brand-features">
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><Users size={16} /></div><span>Manage all users & vendors</span></div>
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><Database size={16} /></div><span>View analytics & statistics</span></div>
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><Settings size={16} /></div><span>Platform-wide controls</span></div>
            </div>
          </motion.div>
        </div>

        <div className="auth-form-panel">
          <motion.div className="auth-form-inner" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <div className="auth-form-header">
              <h2>Admin access</h2>
              <p>Restricted — authorized personnel only</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label><Mail size={16} /> Email</label><input type="email" name="email" required placeholder="admin@gmail.com" /></div>
              <div className="form-group"><label><Lock size={16} /> Password</label><input type="password" name="password" required placeholder="••••••••" /></div>
              <button type="submit" className="btn btn-primary btn-block auth-submit-admin">Access Panel</button>
            </form>
            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
