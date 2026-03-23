import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

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
      <div className="auth-container">
        <div className="auth-card auth-card-wide">
          <div className="auth-header">
            <div className="auth-icon" style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)' }}>
              <i className="fas fa-store"></i>
            </div>
            <h2>Vendor Registration</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label>Name</label><input type="text" name="name" required /></div>
              <div className="form-group"><label>Phone</label><input type="text" name="phone" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Email</label><input type="email" name="email" required /></div>
              <div className="form-group"><label>Password</label><input type="password" name="password" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>City</label><input type="text" name="city" required /></div>
              <div className="form-group"><label>Address</label><input type="text" name="address" required /></div>
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <input type="file" name="profilePic" accept="image/*" />
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)' }}>Register</button>
          </form>
          {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
          <p className="auth-footer">Already have an account? <Link to="/vendor-login">Login here</Link></p>
        </div>
      </div>
    </section>
  );
}
