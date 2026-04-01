import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Send, MapPin, Clock, Headphones } from 'lucide-react';
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

  const contactInfo = [
    { icon: <Mail size={20} />, title: 'Email Us', desc: 'contact@geovendor.com', accent: '#6366f1' },
    { icon: <MapPin size={20} />, title: 'Location', desc: 'India — Nationwide Platform', accent: '#a855f7' },
    { icon: <Clock size={20} />, title: 'Response Time', desc: 'Within 24 hours', accent: '#22d3ee' },
    { icon: <Headphones size={20} />, title: 'Support', desc: '24/7 available', accent: '#10b981' },
  ];

  return (
    <section className="page active" id="page-contact">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="section-chip">Contact</span>
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">Have questions or need support? We'd love to hear from you.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 40, alignItems: 'start' }}>
          {/* Left — Info Cards */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div style={{ display: 'grid', gap: 16 }}>
              {contactInfo.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '20px 24px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${item.accent}15`, color: item.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            style={{
              padding: 36, borderRadius: 20,
              background: 'rgba(16,16,30,0.6)', border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', marginBottom: 6 }}>Send us a message</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 28 }}>Fill out the form and we'll get back to you shortly.</p>
            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label><User size={16} /> Name</label>
                <input type="text" name="contactName" required placeholder="Your full name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Mail size={16} /> Email</label>
                  <input type="email" name="contactEmail" required placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label><Phone size={16} /> Phone</label>
                  <input type="text" name="contactPhone" required placeholder="Phone number" />
                </div>
              </div>
              <div className="form-group">
                <label><MessageSquare size={16} /> Query</label>
                <textarea name="contactQuery" rows="4" required placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                <Send size={16} /> Send Message
              </button>
            </form>
            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
