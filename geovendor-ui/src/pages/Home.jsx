import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
      <div className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Discover Local <span className="gradient-text">Vendors</span> Near You</h1>
          <p>Find trusted businesses, shops, restaurants, and services around your location with GeoVendor.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/user-login')}>
              <i className="fas fa-user"></i> Get Started
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/vendor-login')}>
              <i className="fas fa-store"></i> Register Business
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="feedback-grid" id="homeFeedbacks">
          {feedbacks === null ? (
            <div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i> Loading...</div>
          ) : feedbacks.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No feedbacks yet.</p>
          ) : (
            feedbacks.map((fb, idx) => (
              <div className="feedback-card" key={idx}>
                <div className="fc-header">
                  <div className="fc-avatar">
                    {fb.pic ? (
                      <img src={`/${fb.pic.replace(/\\\\/g, '/')}`} alt="" />
                    ) : (
                      <i className="fas fa-user" style={{ color: '#fff' }}></i>
                    )}
                  </div>
                  <div>
                    <div className="fc-name">{escapeHtml(fb.name)}</div>
                    <div className="fc-stars" dangerouslySetInnerHTML={{ __html: renderStars(fb.rating) }}></div>
                  </div>
                </div>
                <p className="fc-remark">"{escapeHtml(fb.remark || '')}"</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section features-section">
        <h2 className="section-title">Why GeoVendor?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-map-marked-alt"></i></div>
            <h3>Location Based</h3>
            <p>Find vendors pinpointed on the map right near your location.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-star"></i></div>
            <h3>Trusted Reviews</h3>
            <p>Read real feedback from verified users and vendors.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-tags"></i></div>
            <h3>Multiple Categories</h3>
            <p>Shops, hospitals, hotels, restaurants, schools, and more.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
