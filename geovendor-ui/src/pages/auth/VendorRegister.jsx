import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, User, Phone, Mail, Lock, MapPin, Home, Camera, TrendingUp, Globe, BarChart3 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

export default function VendorRegister() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();
    fd.append('name', form.name.value);
    fd.append('phone', form.phone.value);
    fd.append('email', form.email.value);
    fd.append('password', form.password.value);
    fd.append('city', form.city.value);
    fd.append('address', form.address.value);
    if (form.profilePic.files[0]) fd.append('profilePic', form.profilePic.files[0]);

    const res = await api.registerVendor(fd);
    if (res.success) {
      showToast('Registration successful! Please login.');
      navigate('/vendor-login');
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
            <h2>Put Your Business on the Map</h2>
            <p>Register and let nearby customers discover your business through real-time GPS search.</p>
            <div className="auth-brand-features">
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><Globe size={16} /></div><span>Instant visibility to nearby users</span></div>
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><TrendingUp size={16} /></div><span>Broadcast your live location</span></div>
              <div className="auth-brand-feature"><div className="auth-brand-feature-icon"><BarChart3 size={16} /></div><span>Manage reviews and reputation</span></div>
            </div>
          </motion.div>
        </div>

        <div className="auth-form-panel">
          <motion.div className="auth-form-inner wide" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <div className="auth-form-header">
              <h2>Register your business</h2>
              <p>Create your vendor account to get started</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label><User size={16} /> Name</label><input type="text" name="name" required placeholder="Full name" /></div>
                <div className="form-group"><label><Phone size={16} /> Phone</label><input type="text" name="phone" required placeholder="Phone number" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label><Mail size={16} /> Email</label><input type="email" name="email" required placeholder="your@email.com" /></div>
                <div className="form-group"><label><Lock size={16} /> Password</label><input type="password" name="password" required placeholder="Create password" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label><MapPin size={16} /> City</label><input type="text" name="city" required placeholder="Your city" /></div>
                <div className="form-group"><label><Home size={16} /> Address</label><input type="text" name="address" required placeholder="Full address" /></div>
              </div>
              <div className="form-group"><label><Camera size={16} /> Profile Picture</label><input type="file" name="profilePic" accept="image/*" /></div>
              <button type="submit" className="btn btn-primary btn-block auth-submit-vendor">Register Business</button>
            </form>
            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
            <p className="auth-form-footer">Already registered? <Link to="/vendor-login">Sign in</Link></p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
