import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

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
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <h2>Admin Login</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" required placeholder="admin@gmail.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>Login</button>
          </form>
          {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
        </div>
      </div>
    </section>
  );
}
