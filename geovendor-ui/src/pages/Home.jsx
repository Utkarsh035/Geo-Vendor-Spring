import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Tags, ArrowRight, Sparkles, User, Navigation, Shield, Zap, ChevronRight, Store } from 'lucide-react';
import api from '../services/api';
import './Home.css';

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderStars(rating) {
  if (!rating) return '';
  const count = (rating.match(/fas fa-star/g) || []).length;
  let html = '';
  for (let i = 0; i < count; i++) html += '<i class="fas fa-star"></i>';
  for (let i = count; i < 5; i++) html += '<i class="far fa-star" style="opacity:0.3"></i>';
  return html;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / end), 20);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const [feedbacks, setFeedbacks] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getHomeData().then((res) => {
      if (res.success) {
        const all = [];
        (res.data.userFeedbacks || []).forEach((u) => {
          if (u.fd) all.push({ name: u.fd.name, rating: u.fd.rating, remark: u.fd.remark, pic: u.profilePic });
        });
        (res.data.vendorFeedbacks || []).forEach((v) => {
          if (v.vf) all.push({ name: v.vf.name, rating: v.vf.rating, remark: v.vf.remark, pic: v.profilePic });
        });
        setFeedbacks(all);
      }
    }).catch(console.error);
  }, []);

  return (
    <section className="page active" id="page-home">
      {/* ====== HERO ====== */}
      <div className="hero-section">
        <div className="hero-gradient-mesh"></div>
        <div className="hero-grid-pattern"></div>
        <div className="hero-radial-glow"></div>
        
        <motion.div
          className="hero-inner"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
        >
          <motion.div variants={fadeUp} className="hero-chip">
            <span className="hero-chip-dot"></span>
            <Sparkles size={13} /> Platform v2.0 — Now with Live Tracking
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="hero-headline">
            Find Trusted <span className="hero-gradient-word">Vendors</span><br />
            Around Your Location
          </motion.h1>
          
          <motion.p variants={fadeUp} className="hero-desc">
            Discover shops, restaurants, hospitals, and services — all mapped in real-time
            around your exact GPS coordinates. Track vendors live, read reviews, and connect instantly.
          </motion.p>
          
          <motion.div variants={fadeUp} className="hero-cta-row">
            <button className="hero-btn-primary" onClick={() => navigate('/user-login')}>
              <User size={18} /> Get Started Free
              <ChevronRight size={16} />
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate('/vendor-login')}>
              <Store size={18} /> List Your Business
            </button>
          </motion.div>
          
          <motion.div variants={fadeUp} className="hero-trust">
            <div className="hero-trust-avatars">
              {['#6366f1', '#a855f7', '#ec4899', '#22d3ee'].map((c, i) => (
                <div key={i} className="hero-trust-avatar" style={{ background: c, zIndex: 4 - i }}></div>
              ))}
            </div>
            <span className="hero-trust-text">Trusted by <strong>500+</strong> businesses nationwide</span>
          </motion.div>
        </motion.div>

        {/* Floating Stats Cards */}
        <motion.div 
          className="hero-float-card hero-float-1"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Navigation size={20} className="hero-float-icon" />
          <div>
            <div className="hero-float-value">Live</div>
            <div className="hero-float-label">GPS Tracking</div>
          </div>
        </motion.div>
        <motion.div 
          className="hero-float-card hero-float-2"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <Shield size={20} className="hero-float-icon" />
          <div>
            <div className="hero-float-value">Verified</div>
            <div className="hero-float-label">Businesses</div>
          </div>
        </motion.div>
      </div>

      {/* ====== STATS BAR ====== */}
      <motion.div 
        className="stats-bar"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="stats-bar-inner">
          {[
            { value: '500', suffix: '+', label: 'Registered Businesses' },
            { value: '10', suffix: 'K+', label: 'Active Users' },
            { value: '6', suffix: '+', label: 'Business Categories' },
            { value: '99', suffix: '%', label: 'Uptime Guaranteed' },
          ].map((s, i) => (
            <div className="stats-bar-item" key={i}>
              <div className="stats-bar-value"><AnimatedCounter target={s.value} suffix={s.suffix} /></div>
              <div className="stats-bar-label">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ====== HOW IT WORKS ====== */}
      <div className="how-section">
        <div className="how-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="how-header"
          >
            <span className="section-chip">How it Works</span>
            <h2 className="section-title">Get started in 3 simple steps</h2>
            <p className="section-subtitle">From signup to discovering your nearest vendor in under a minute</p>
          </motion.div>
          
          <div className="how-steps">
            {[
              { step: '01', icon: <User size={28} />, title: 'Create Account', desc: 'Sign up in seconds with your email. No credit card required — completely free for users.' },
              { step: '02', icon: <MapPin size={28} />, title: 'Allow Location', desc: 'Enable GPS and we\'ll automatically find all registered businesses within 5 km of you.' },
              { step: '03', icon: <Navigation size={28} />, title: 'Track & Connect', desc: 'View vendor details, get live directions, call directly, and track in real-time on the map.' },
            ].map((item, idx) => (
              <motion.div 
                className="how-step-card" 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                <div className="how-step-number">{item.step}</div>
                <div className="how-step-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {idx < 2 && <div className="how-step-connector"><ChevronRight size={20} /></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== FEATURES ====== */}
      <div className="features-v2">
        <div className="features-v2-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-chip">Features</span>
            <h2 className="section-title">Everything you need</h2>
            <p className="section-subtitle">Powerful tools for both users and business owners</p>
          </motion.div>

          <div className="features-v2-grid">
            {[
              { icon: <MapPin size={24} />, title: 'Location Based Discovery', desc: 'GPS-powered vendor search within a 5 km radius with real-time distance calculations.', accent: '#6366f1' },
              { icon: <Zap size={24} />, title: 'Live GPS Tracking', desc: 'Track vendor location in real-time with 8-second updates, just like ride-sharing apps.', accent: '#22d3ee' },
              { icon: <Star size={24} />, title: 'Ratings & Reviews', desc: 'Authentic feedback system with star ratings from verified users and vendors.', accent: '#f59e0b' },
              { icon: <Tags size={24} />, title: 'Multiple Categories', desc: 'Shops, hospitals, hotels, restaurants, schools, offices — organized and searchable.', accent: '#a855f7' },
              { icon: <Shield size={24} />, title: 'Business Verification', desc: 'GST-verified businesses with complete profiles including photos and contact info.', accent: '#10b981' },
              { icon: <Navigation size={24} />, title: 'Route Navigation', desc: 'Integrated maps with real routes, ETA estimation, and Google Maps handoff.', accent: '#ec4899' },
            ].map((f, idx) => (
              <motion.div
                className="feat-card"
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <div className="feat-card-icon" style={{ background: `${f.accent}15`, color: f.accent }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== TESTIMONIALS ====== */}
      <div className="testimonials-section">
        <div className="testimonials-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-chip">Testimonials</span>
            <h2 className="section-title">Loved by users everywhere</h2>
            <p className="section-subtitle">See what the community has to say about GeoVendor</p>
          </motion.div>

          <div className="testimonials-grid" id="homeFeedbacks">
            {feedbacks === null ? (
              <div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i> Loading testimonials...</div>
            ) : feedbacks.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No testimonials yet. Be the first to share your experience!</p>
            ) : (
              feedbacks.map((fb, idx) => (
                <motion.div
                  className="testimonial-card"
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                >
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{escapeHtml(fb.remark || 'Great experience!')}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      {fb.pic ? (
                        <img src={`/${fb.pic.replace(/\\\\/g, '/')}`} alt="" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div>
                      <div className="testimonial-name">{escapeHtml(fb.name)}</div>
                      <div className="testimonial-stars" dangerouslySetInnerHTML={{ __html: renderStars(fb.rating) }}></div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ====== CTA BANNER ====== */}
      <div className="cta-banner">
        <motion.div 
          className="cta-banner-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-banner-glow"></div>
          <h2>Ready to discover vendors near you?</h2>
          <p>Join thousands of users who find trusted businesses every day.</p>
          <div className="cta-banner-btns">
            <button className="hero-btn-primary" onClick={() => navigate('/user-register')}>
              Start Exploring <ArrowRight size={16} />
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate('/vendor-register')}>
              Register as Vendor
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
