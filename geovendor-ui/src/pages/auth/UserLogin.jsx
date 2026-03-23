import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

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
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon"><i className="fas fa-user-circle"></i></div>
            <h2>User Login</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" required placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Login</button>
          </form>
          {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
          <p className="auth-footer">Don't have an account? <Link to="/user-register">Register here</Link></p>
        </div>
      </div>
    </section>
  );
}
