import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.contactName.value,
      email: form.contactEmail.value,
      phone: form.contactPhone.value,
      query: form.contactQuery.value,
    };
    const res = await api.submitContact(data);
    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      showToast(res.message);
      form.reset();
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <section className="page active" id="page-contact">
      <div className="section">
        <h2 className="section-title">Contact Us</h2>
        <div className="form-card">
          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label><i className="fas fa-user"></i> Name</label>
              <input type="text" name="contactName" required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label><i className="fas fa-envelope"></i> Email</label>
              <input type="email" name="contactEmail" required placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label><i className="fas fa-phone"></i> Phone</label>
              <input type="text" name="contactPhone" required placeholder="Your phone number" />
            </div>
            <div className="form-group">
              <label><i className="fas fa-comment"></i> Query</label>
              <textarea name="contactQuery" rows="4" required placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Send Message</button>
          </form>
          {message.text && (
            <div className={`form-message ${message.type}`}>{message.text}</div>
          )}
        </div>
      </div>
    </section>
  );
}
