import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/StarRating';

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Haversine formula: distance in km between two lat/lng points
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [businesses, setBusinesses] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [fbRating, setFbRating] = useState('');
  const [message, setMessage] = useState({ id: '', text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('detecting'); // 'detecting' | 'found' | 'denied'

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'user') { navigate('/user-login'); return; }
    loadProfile();
  }, [currentUser]);

  const loadProfile = async () => {
    const res = await api.getUserProfile(currentUser.email);
    if (res.success) {
      setProfile(res.data);
      setEditForm({
        name: res.data.name || '',
        phone: res.data.phone || '',
        city: res.data.city || '',
        address: res.data.address || '',
      });
    }
  };

  const loadBusinesses = async () => {
    const res = await api.getAllBusinesses();
    if (res.success) setBusinesses(res.data || []);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('found');
      },
      () => {
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'map') {
      loadBusinesses();
      if (!userLocation) requestLocation();
    }
    if (tab === 'profile') loadProfile();
  };

  // Compute filtered + sorted businesses
  const getDisplayedBusinesses = () => {
    if (!businesses || locationStatus === 'detecting') return null;
    let list = [...businesses];
    const isSearching = searchQuery.trim().length > 0;

    // Filter by search query
    if (isSearching) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) =>
        (b.businessName || '').toLowerCase().includes(q) ||
        (b.businessCategory || '').toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q) ||
        (b.address || '').toLowerCase().includes(q)
      );
    }

    // Compute distance and sort
    if (userLocation) {
      list = list.map((b) => {
        const lat = parseFloat(b.locationLat);
        const lng = parseFloat(b.locationLong);
        const dist = (!isNaN(lat) && !isNaN(lng))
          ? haversineDistance(userLocation.lat, userLocation.lng, lat, lng)
          : null;
        return { ...b, _distance: dist };
      });
      list.sort((a, b) => {
        if (a._distance === null && b._distance === null) return 0;
        if (a._distance === null) return 1;
        if (b._distance === null) return -1;
        return a._distance - b._distance;
      });

      // When NOT searching, only show businesses within 5km
      if (!isSearching) {
        list = list.filter((b) => b._distance !== null && b._distance <= 5);
      }
    }

    return list;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', editForm.name);
    fd.append('phone', editForm.phone);
    fd.append('city', editForm.city);
    fd.append('address', editForm.address);
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput?.files[0]) fd.append('profilePic', fileInput.files[0]);

    const res = await api.updateUserProfile(currentUser.email, fd);
    if (res.success) {
      showToast('Profile updated!');
      setMessage({ id: 'edit', text: 'Profile updated successfully', type: 'success' });
    } else {
      setMessage({ id: 'edit', text: res.message, type: 'error' });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.fbName.value,
      email: form.fbEmail.value,
      rating: fbRating,
      remark: form.fbRemark.value,
    };
    if (!data.rating) { showToast('Please select a rating', 'error'); return; }
    const res = await api.submitUserFeedback(data);
    if (res.success) {
      showToast('Feedback submitted!');
      setMessage({ id: 'feedback', text: res.message, type: 'success' });
      form.reset();
      setFbRating('');
    } else {
      setMessage({ id: 'feedback', text: res.message, type: 'error' });
    }
  };

  if (!currentUser) return null;

  return (
    <section className="page active">
      <div className="dashboard">
        <div className="dash-sidebar">
          <div className="dash-profile">
            <div className="dash-avatar"><i className="fas fa-user"></i></div>
            <h3>{profile?.name || 'User'}</h3>
            <p>{currentUser.email}</p>
          </div>
          <nav className="dash-nav">
            <a href="#" className={`dash-link${activeTab === 'profile' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); switchTab('profile'); }}><i className="fas fa-user"></i> Profile</a>
            <a href="#" className={`dash-link${activeTab === 'edit' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); switchTab('edit'); }}><i className="fas fa-edit"></i> Edit Profile</a>
            <a href="#" className={`dash-link${activeTab === 'map' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); switchTab('map'); }}><i className="fas fa-map"></i> View Map</a>
            <a href="#" className={`dash-link${activeTab === 'feedback' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); switchTab('feedback'); }}><i className="fas fa-star"></i> Feedback</a>
          </nav>
        </div>

        <div className="dash-main">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-user"></i> My Profile</h2>
              {!profile ? (
                <div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i> Loading...</div>
              ) : (
                <div className="profile-details">
                  {profile.profilePic && (
                    <div className="profile-pic-large"><img src={`/${profile.profilePic.replace(/\\\\/g, '/')}`} alt="Profile" /></div>
                  )}
                  <div className="profile-row"><span className="pr-label">Name</span><span className="pr-value">{escapeHtml(profile.name)}</span></div>
                  <div className="profile-row"><span className="pr-label">Email</span><span className="pr-value" style={{ color: 'var(--accent)' }}>{escapeHtml(profile.email)}</span></div>
                  <div className="profile-row"><span className="pr-label">Phone</span><span className="pr-value">{escapeHtml(profile.phone || '-')}</span></div>
                  <div className="profile-row"><span className="pr-label">City</span><span className="pr-value">{escapeHtml(profile.city || '-')}</span></div>
                  <div className="profile-row"><span className="pr-label">Address</span><span className="pr-value">{escapeHtml(profile.address || '-')}</span></div>
                  <div className="profile-row"><span className="pr-label">Registered</span><span className="pr-value">{profile.date || '-'}</span></div>
                </div>
              )}
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === 'edit' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-edit"></i> Edit Profile</h2>
              <div className="form-card">
                <form onSubmit={handleEditSubmit}>
                  <div className="form-row">
                    <div className="form-group"><label>Name</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></div>
                    <div className="form-group"><label>Phone</label><input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>City</label><input type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} required /></div>
                    <div className="form-group"><label>Address</label><input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required /></div>
                  </div>
                  <div className="form-group"><label>Profile Picture</label><input type="file" accept="image/*" /></div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
                {message.id === 'edit' && message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
              </div>
            </div>
          )}

          {/* Map / Business Tab */}
          {activeTab === 'map' && (() => {
            const displayed = getDisplayedBusinesses();
            return (
            <div className="dash-tab active">
              <h2><i className="fas fa-map"></i> Nearby Businesses</h2>

              {/* Search Bar */}
              <div className="business-search-bar">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    placeholder="Search businesses by name, category, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    id="businessSearchInput"
                  />
                  {searchQuery && (
                    <button className="search-clear-btn" onClick={() => setSearchQuery('')} title="Clear search">
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                <div className="location-status">
                  {locationStatus === 'detecting' && (
                    <span className="loc-detecting"><i className="fas fa-spinner fa-spin"></i> Detecting location...</span>
                  )}
                  {locationStatus === 'found' && (
                    <span className="loc-found"><i className="fas fa-map-marker-alt"></i> Showing businesses within 5 km</span>
                  )}
                  {locationStatus === 'denied' && (
                    <span className="loc-denied"><i className="fas fa-exclamation-triangle"></i> Location unavailable — showing all businesses</span>
                  )}
                </div>
              </div>

              {/* Business Grid */}
              <div className="business-grid">
                {displayed === null ? (
                  <div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i> Loading...</div>
                ) : displayed.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                    {searchQuery
                      ? `No businesses found for "${searchQuery}"`
                      : userLocation
                        ? 'No businesses found within 5 km. Use search to find businesses further away.'
                        : 'No businesses registered yet.'}
                  </p>
                ) : (
                  displayed.map((b, idx) => (
                    <div className="business-card" key={idx}>
                      <div className="bc-header">
                        <div className="bc-icon"><i className={b.businessIcon || 'fas fa-store'}></i></div>
                        <div>
                          <div className="bc-name">{escapeHtml(b.businessName || '')}</div>
                          <span className="bc-category">{escapeHtml(b.businessCategory || '')}</span>
                        </div>
                      </div>
                      {b._distance != null && (
                        <div className="bc-distance">
                          <i className="fas fa-location-arrow"></i> {b._distance < 1 ? `${Math.round(b._distance * 1000)} m` : `${b._distance.toFixed(1)} km`} away
                        </div>
                      )}
                      <div className="bc-details">
                        {b.description && <div className="bc-row"><i className="fas fa-info-circle"></i><span>{escapeHtml(b.description)}</span></div>}
                        <div className="bc-row"><i className="fas fa-phone"></i><span>{escapeHtml(b.phone || '-')}</span></div>
                        <div className="bc-row"><i className="fas fa-map-marker-alt"></i><span>{escapeHtml(b.address || '-')}</span></div>
                        {b.gstNo && <div className="bc-row"><i className="fas fa-id-card"></i><span>GST: {escapeHtml(b.gstNo)}</span></div>}
                      </div>
                      {b.locationLat && b.locationLong && (
                        <a
                          className="btn-get-route"
                          href={`https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : ''}&destination=${b.locationLat},${b.locationLong}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fas fa-directions"></i> Get Route
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            );
          })()}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-star"></i> Submit Feedback</h2>
              <div className="form-card">
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="form-row">
                    <div className="form-group"><label>Name</label><input type="text" name="fbName" required /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="fbEmail" required /></div>
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <StarRating value={fbRating} onChange={setFbRating} />
                  </div>
                  <div className="form-group"><label>Remark</label><textarea name="fbRemark" rows="3" placeholder="Share your experience..."></textarea></div>
                  <button type="submit" className="btn btn-primary">Submit Feedback</button>
                </form>
                {message.id === 'feedback' && message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
