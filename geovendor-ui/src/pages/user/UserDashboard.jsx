import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit3, Map, Star, Search, X, MapPin, Phone, Info, CreditCard, Navigation, Clock, Circle, ExternalLink, PhoneCall, LogOut, Compass } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/StarRating';
import LiveTrackingMap from '../../components/LiveTrackingMap';
import '../Dashboard.css';

// Helpers
function escapeHtml(str) { if (!str) return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1); const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function UserDashboard() {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('map');
  const [profile, setProfile] = useState(null);
  const [businesses, setBusinesses] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [fbRating, setFbRating] = useState('');
  const [message, setMessage] = useState({ id: '', text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('detecting');
  const [trackingBusiness, setTrackingBusiness] = useState(null);
  const [isTrackingMode, setIsTrackingMode] = useState(false);
  const trackingIntervalRef = useRef(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'user') { navigate('/user-login'); return; }
    loadProfile();
    requestLocation();
    loadBusinesses();
    return () => { if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current); };
  }, [currentUser]);

  const loadProfile = async () => {
    const res = await api.getUserProfile(currentUser.email);
    if (res.success) {
      setProfile(res.data);
      setEditForm({ name: res.data.name || '', phone: res.data.phone || '', city: res.data.city || '', address: res.data.address || '' });
    }
  };

  const loadBusinesses = async () => { const res = await api.getAllBusinesses(); if (res.success) setBusinesses(res.data || []); };

  const requestLocation = () => {
    if (!navigator.geolocation) { setLocationStatus('denied'); return; }
    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationStatus('found'); },
      () => { setLocationStatus('denied'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const startLiveTracking = (business) => {
    setTrackingBusiness(business);
    setIsTrackingMode(true);
    updateTrackingLocation(business.email);
    if (business.isActive !== false) {
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = setInterval(() => { updateTrackingLocation(business.email); }, 8000);
    }
  };

  const stopLiveTracking = () => {
    if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    trackingIntervalRef.current = null;
    setIsTrackingMode(false);
    setTrackingBusiness(null);
  };

  const updateTrackingLocation = async (email) => {
    const res = await api.getBusinessDetails(email);
    if (res.success) {
      setTrackingBusiness(res.data);
      if (res.data.isActive === false) { showToast('Vendor has gone offline.', 'warning'); stopLiveTracking(); }
    }
  };

  const getDisplayedBusinesses = () => {
    if (!businesses || locationStatus === 'detecting') return null;
    let list = [...businesses];
    const isSearching = searchQuery.trim().length > 0;
    if (isSearching) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) => (b.businessName || '').toLowerCase().includes(q) || (b.businessCategory || '').toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q) || (b.address || '').toLowerCase().includes(q));
    }
    if (userLocation) {
      list = list.map((b) => {
        const lat = parseFloat(b.locationLat), lng = parseFloat(b.locationLong);
        const dist = (!isNaN(lat) && !isNaN(lng)) ? haversineDistance(userLocation.lat, userLocation.lng, lat, lng) : null;
        return { ...b, _distance: dist };
      });
      list.sort((a, b) => { if (a._distance === null && b._distance === null) return 0; if (a._distance === null) return 1; if (b._distance === null) return -1; return a._distance - b._distance; });
      if (!isSearching) list = list.filter((b) => b._distance !== null && b._distance <= 5);
    }
    return list;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', editForm.name); fd.append('phone', editForm.phone); fd.append('city', editForm.city); fd.append('address', editForm.address);
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput?.files[0]) fd.append('profilePic', fileInput.files[0]);
    const res = await api.updateUserProfile(currentUser.email, fd);
    if (res.success) { showToast('Profile updated!'); setMessage({ id: 'edit', text: 'Profile updated successfully', type: 'success' }); loadProfile(); }
    else { setMessage({ id: 'edit', text: res.message, type: 'error' }); }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { name: form.fbName.value, email: form.fbEmail.value, rating: fbRating, remark: form.fbRemark.value };
    if (!data.rating) { showToast('Please select a rating', 'error'); return; }
    const res = await api.submitUserFeedback(data);
    if (res.success) { showToast('Feedback submitted!'); setMessage({ id: 'feedback', text: res.message, type: 'success' }); form.reset(); setFbRating(''); }
    else { setMessage({ id: 'feedback', text: res.message, type: 'error' }); }
  };

  if (!currentUser) return null;

  const tabs = [
    { key: 'map', icon: <MapPin size={18} />, label: 'Explore Businesses' },
    { key: 'profile', icon: <User size={18} />, label: 'My Profile' },
    { key: 'feedback', icon: <Star size={18} />, label: 'Submit Feedback' },
  ];

  const renderTabContent = () => {
    if (activeTab === 'map') {
      const displayed = getDisplayedBusinesses();
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="saas-search" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} className="saas-search-icon" />
              <input type="text" placeholder="Search by name, category, or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#71717a', cursor: 'pointer' }}><X size={16} /></button>}
            </div>
            
            <div style={{ marginTop: 12, fontSize: '0.8rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: 6 }}>
              {locationStatus === 'detecting' && <><i className="fas fa-spinner fa-spin"></i> Detecting your location...</>}
              {locationStatus === 'found' && <><MapPin size={14} color="#10b981" /> GPS Active — Showing businesses within 5 km.</>}
              {locationStatus === 'denied' && <><Info size={14} color="#fbbf24" /> GPS Denied — Showing all global businesses.</>}
            </div>
          </div>

          <div className="saas-grid">
            {displayed === null ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div className="saas-card" key={`skel-${idx}`} style={{ opacity: 0.5 }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 16 }}></div>
                  <div style={{ width: '60%', height: 18, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ width: '40%', height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}></div>
                </div>
              ))
            ) : displayed.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#71717a' }}>
                <Compass size={40} style={{ opacity: 0.5, marginBottom: 16 }} />
                <p>{searchQuery ? `No businesses found matching "${searchQuery}"` : 'No businesses available nearby.'}</p>
              </div>
            ) : (
              displayed.map((b, idx) => (
                <div className="saas-card" key={idx} style={{ opacity: b.isActive === false ? 0.6 : 1 }}>
                  <div className="saas-card-glow"></div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                        <i className={b.businessIcon || 'fas fa-store'}></i>
                      </div>
                      <div className={`biz-status ${b.isActive === false ? 'closed' : 'open'}`}>
                        {b.isActive === false ? 'Closed' : 'Open'}
                      </div>
                    </div>
                    
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f4f4f5', marginTop: 16, marginBottom: 4 }}>{escapeHtml(b.businessName)}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 500 }}>{escapeHtml(b.businessCategory)}</div>

                    {b._distance != null && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, marginTop: 12, border: '1px solid rgba(99,102,241,0.2)' }}>
                        <Navigation size={12} /> {b._distance < 1 ? `${Math.round(b._distance * 1000)} m away` : `${b._distance.toFixed(1)} km away`}
                      </div>
                    )}

                    <div className="biz-meta">
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {b.address && <div className="biz-meta-item"><MapPin size={14} /> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{escapeHtml(b.address)}</span></div>}
                        {b.phone && <div className="biz-meta-item"><Phone size={14} /> <span>{escapeHtml(b.phone)}</span></div>}
                      </div>
                    </div>
                    
                    {b.locationLat && b.locationLong && (
                      <button 
                        style={{ width: '100%', padding: '10px', marginTop: 20, background: 'white', color: 'black', border: 'none', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'opacity 0.2s' }}
                        onClick={() => startLiveTracking(b)}
                        onMouseOver={(e) => e.target.style.opacity = 0.9}
                        onMouseOut={(e) => e.target.style.opacity = 1}
                      >
                        <Navigation size={16} /> Track on Map
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      );
    }
    
    if (activeTab === 'profile') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 32 }}>
          
          <div className="saas-card" style={{ alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 20, color: '#f4f4f5' }}>Profile Information</h3>
            {!profile ? <div style={{ color: '#71717a' }}>Loading...</div> : (
              <div>
                {profile.profilePic && (
                  <div style={{ width: 80, height: 80, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(99,102,241,0.3)', marginBottom: 24 }}>
                    <img src={`/${profile.profilePic.replace(/\\\\/g, '/')}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4 }}>Name</div><div style={{ color: '#e4e4e7', fontWeight: 500 }}>{escapeHtml(profile.name)}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4 }}>Email</div><div style={{ color: '#818cf8', fontWeight: 500 }}>{escapeHtml(profile.email)}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4 }}>Phone</div><div style={{ color: '#e4e4e7' }}>{escapeHtml(profile.phone)}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4 }}>Location</div><div style={{ color: '#e4e4e7' }}>{escapeHtml(profile.address)}, {escapeHtml(profile.city)}</div></div>
                </div>
              </div>
            )}
          </div>

          <div className="saas-card" style={{ alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 20, color: '#f4f4f5' }}>Edit Profile</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="saas-form-group"><label>Full Name</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></div>
                <div className="saas-form-group"><label>Phone Number</label><input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="saas-form-group"><label>City</label><input type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} required /></div>
                <div className="saas-form-group"><label>Full Address</label><input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required /></div>
              </div>
              <div className="saas-form-group">
                <label>Profile Picture</label>
                <input type="file" accept="image/*" style={{ padding: '8px' }} />
              </div>
              <button type="submit" className="saas-btn-primary" style={{ marginTop: 8 }}>Save Changes</button>
              {message.id === 'edit' && <div style={{ marginTop: 16, color: message.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>{message.text}</div>}
            </form>
          </div>

        </motion.div>
      );
    }

    if (activeTab === 'feedback') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="saas-card" style={{ maxWidth: 600 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 4, color: '#f4f4f5' }}>Platform Feedback</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: 24 }}>Help us improve GeoVendor by sharing your experience.</p>
            
            <form onSubmit={handleFeedbackSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="saas-form-group"><label>Name</label><input type="text" name="fbName" defaultValue={profile?.name || ''} required /></div>
                <div className="saas-form-group"><label>Email</label><input type="email" name="fbEmail" defaultValue={profile?.email || ''} required /></div>
              </div>
              <div className="saas-form-group">
                <label>Rating</label>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: 12, borderRadius: 8 }}>
                  <StarRating value={fbRating} onChange={setFbRating} />
                </div>
              </div>
              <div className="saas-form-group"><label>Comments</label><textarea name="fbRemark" rows="4" placeholder="Share your detailed feedback..." required></textarea></div>
              <button type="submit" className="saas-btn-primary">Submit Review</button>
              {message.id === 'feedback' && <div style={{ marginTop: 16, color: message.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>{message.text}</div>}
            </form>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="saas-dashboard">
      <aside className="saas-sidebar">
        <div className="saas-sidebar-header">
          <div className="saas-brand-icon"><MapPin size={20} /></div>
          <span className="saas-brand-text">GeoVendor</span>
        </div>
        
        <div className="saas-nav-group">
          <div className="saas-nav-label">DISCOVERY</div>
          {tabs.map(tab => (
            <div 
              key={tab.key}
              className={`saas-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key !== 'map') stopLiveTracking();
              }}
            >
              <span className="saas-nav-icon">{tab.icon}</span>
              {tab.label}
            </div>
          ))}
        </div>

        <div className="saas-sidebar-footer">
          <div className="saas-user-card">
            <div className="saas-user-avatar">
              {profile?.profilePic ? <img src={`/${profile.profilePic.replace(/\\\\/g, '/')}`} alt="" /> : <User size={20} color="#71717a" />}
            </div>
            <div className="saas-user-info">
              <div className="saas-user-name">{profile?.name || 'User'}</div>
              <div className="saas-user-role">Consumer Account</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="saas-main">
        <header className="saas-topbar">
          <div className="saas-breadcrumb">
            {tabs.find(t => t.key === activeTab)?.icon} 
            {tabs.find(t => t.key === activeTab)?.label}
          </div>
          <div className="saas-topbar-actions">
            <button className="saas-btn-outline" onClick={() => navigate('/')}><MapPin size={16} /> Public Map</button>
            <button className="saas-btn-outline" onClick={() => { logout(); showToast('Logged out'); navigate('/'); }} style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <div className="saas-content-area">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>

        {/* Live Tracking Modal Overlay */}
        {isTrackingMode && trackingBusiness && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: 1000, maxHeight: '95vh', background: '#09090b', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              
              {/* Modal Header */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.4rem' }}>
                    <i className={trackingBusiness.businessIcon || 'fas fa-store'}></i>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', margin: 0 }}>{escapeHtml(trackingBusiness.businessName)}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      {trackingBusiness.isActive !== false ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}><Circle size={8} fill="#10b981" /> Live GPS Tracking Active</span> : <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fbbf24', fontSize: '0.85rem', fontWeight: 500 }}><Clock size={12} /> Vendor Offline • Last Known Location</span>}
                    </div>
                  </div>
                </div>
                <button onClick={stopLiveTracking} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#a1a1aa'; }}><X size={20} /></button>
              </div>

              {/* Map Body */}
              <div style={{ flex: 1, minHeight: 300, width: '100%', background: '#000', position: 'relative' }}>
                <LiveTrackingMap userLocation={userLocation} vendorLocation={{ lat: parseFloat(trackingBusiness.locationLat), lng: parseFloat(trackingBusiness.locationLong) }} businessName={trackingBusiness.businessName} businessIcon={trackingBusiness.businessIcon} />
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                     <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>DISTANCE</div>
                     <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 500 }}>{trackingBusiness._distance != null && trackingBusiness._distance < 1 ? Math.round(trackingBusiness._distance * 1000) + ' m' : (trackingBusiness._distance?.toFixed(1) || '-') + ' km'}</div>
                  </div>
                  <div>
                     <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.05em' }}>PHONE</div>
                     <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 500 }}>{trackingBusiness.phone}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button onClick={stopLiveTracking} style={{ padding: '10px 20px', borderRadius: 8, background: 'none', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#a1a1aa'; }}>
                    Close Map
                  </button>
                  <button onClick={() => window.open(`tel:${trackingBusiness.phone}`)} style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <PhoneCall size={16} /> Call Vendor
                  </button>
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${trackingBusiness.locationLat},${trackingBusiness.locationLong}`)} style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                    <ExternalLink size={16} /> Open in Google Maps
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
