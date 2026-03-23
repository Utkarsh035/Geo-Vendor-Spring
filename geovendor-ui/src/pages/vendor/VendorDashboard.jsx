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

const vendorGradient = 'linear-gradient(135deg,#f093fb,#f5576c)';

export default function VendorDashboard() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [vendorData, setVendorData] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [fbRating, setFbRating] = useState('');
  const [message, setMessage] = useState({ id: '', text: '', type: '' });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'vendor') { navigate('/vendor-login'); return; }
    loadProfile();
  }, [currentUser]);

  const loadProfile = async () => {
    const res = await api.getVendorProfile(currentUser.email);
    if (res.success) {
      setVendorData(res.data);
      const v = res.data.vendor;
      setEditForm({ name: v.name || '', phone: v.phone || '', city: v.city || '', address: v.address || '' });
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'profile' || tab === 'edit' || tab === 'business') loadProfile();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await api.updateVendorProfile(currentUser.email, editForm);
    if (res.success) {
      showToast('Profile updated!');
      setMessage({ id: 'edit', text: 'Profile updated successfully', type: 'success' });
    } else {
      setMessage({ id: 'edit', text: res.message, type: 'error' });
    }
  };

  const handleAddBusiness = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();
    fd.append('name', form.bizName.value);
    fd.append('category', form.bizCategory.value);
    fd.append('description', form.bizDesc.value);
    fd.append('phone', form.bizPhone.value);
    fd.append('gst', form.bizGst.value);
    fd.append('address', form.bizAddress.value);
    if (form.bizPhoto?.files[0]) fd.append('businessPhoto', form.bizPhoto.files[0]);

    const res = await api.addBusiness(currentUser.email, fd);
    if (res.success) {
      showToast('Business added!');
      loadProfile();
    } else {
      setMessage({ id: 'bizAdd', text: res.message, type: 'error' });
    }
  };

  const handleEditBusiness = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.editBizName.value,
      phone: form.editBizPhone.value,
      gst: form.editBizGst.value,
      address: form.editBizAddress.value,
    };
    const res = await api.editBusiness(currentUser.email, data);
    if (res.success) {
      showToast('Business updated!');
      setMessage({ id: 'bizEdit', text: 'Business updated successfully', type: 'success' });
    } else {
      setMessage({ id: 'bizEdit', text: res.message, type: 'error' });
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    const data = { lat: e.target.lat.value, lng: e.target.lng.value };
    const res = await api.updateLocation(currentUser.email, data);
    if (res.success) {
      showToast('Location updated!');
      setMessage({ id: 'location', text: 'Location updated successfully', type: 'success' });
    } else {
      setMessage({ id: 'location', text: res.message, type: 'error' });
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
    const res = await api.submitVendorFeedback(data);
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
  const v = vendorData?.vendor;
  const b = vendorData?.business;

  return (
    <section className="page active">
      <div className="dashboard">
        <div className="dash-sidebar vendor-sidebar">
          <div className="dash-profile">
            <div className="dash-avatar" style={{ background: vendorGradient }}><i className="fas fa-store"></i></div>
            <h3>{v?.name || 'Vendor'}</h3>
            <p>{currentUser.email}</p>
          </div>
          <nav className="dash-nav">
            {['profile', 'edit', 'business', 'location', 'feedback'].map((tab) => {
              const icons = { profile: 'fa-user', edit: 'fa-edit', business: 'fa-briefcase', location: 'fa-map-pin', feedback: 'fa-star' };
              const labels = { profile: 'Profile', edit: 'Edit Profile', business: 'Business', location: 'Location', feedback: 'Feedback' };
              return (
                <a key={tab} href="#" className={`dash-link${activeTab === tab ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); switchTab(tab); }}>
                  <i className={`fas ${icons[tab]}`}></i> {labels[tab]}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="dash-main">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-user"></i> My Profile</h2>
              {!v ? <div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i> Loading...</div> : (
                <div className="profile-details">
                  {v.profilePic && <div className="profile-pic-large"><img src={`/${v.profilePic.replace(/\\\\/g, '/')}`} alt="Profile" /></div>}
                  <div className="profile-row"><span className="pr-label">Name</span><span className="pr-value">{escapeHtml(v.name)}</span></div>
                  <div className="profile-row"><span className="pr-label">Email</span><span className="pr-value" style={{ color: 'var(--accent)' }}>{escapeHtml(v.email)}</span></div>
                  <div className="profile-row"><span className="pr-label">Phone</span><span className="pr-value">{escapeHtml(v.phone || '-')}</span></div>
                  <div className="profile-row"><span className="pr-label">City</span><span className="pr-value">{escapeHtml(v.city || '-')}</span></div>
                  <div className="profile-row"><span className="pr-label">Address</span><span className="pr-value">{escapeHtml(v.address || '-')}</span></div>
                  {b && (
                    <>
                      <h3 style={{ marginTop: 24, marginBottom: 12 }}><i className="fas fa-briefcase" style={{ color: 'var(--accent)' }}></i> Business Details</h3>
                      <div className="profile-row"><span className="pr-label">Business Name</span><span className="pr-value">{escapeHtml(b.businessName || '-')}</span></div>
                      <div className="profile-row"><span className="pr-label">Category</span><span className="pr-value">{escapeHtml(b.businessCategory || '-')}</span></div>
                      <div className="profile-row"><span className="pr-label">Location</span><span className="pr-value">{b.locationLat || '-'}, {b.locationLong || '-'}</span></div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Edit Profile */}
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
                  <button type="submit" className="btn btn-primary" style={{ background: vendorGradient }}>Save Changes</button>
                </form>
                {message.id === 'edit' && message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
              </div>
            </div>
          )}

          {/* Business */}
          {activeTab === 'business' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-briefcase"></i> My Business</h2>
              {b ? (
                <>
                  <div className="business-card" style={{ border: 'none', padding: 0 }}>
                    <div className="bc-header">
                      <div className="bc-icon"><i className={b.businessIcon || 'fas fa-store'}></i></div>
                      <div>
                        <div className="bc-name">{escapeHtml(b.businessName || '')}</div>
                        <span className="bc-category">{escapeHtml(b.businessCategory || '')}</span>
                      </div>
                    </div>
                    <div className="bc-details">
                      {b.description && <div className="bc-row"><i className="fas fa-info-circle"></i><span>{escapeHtml(b.description)}</span></div>}
                      <div className="bc-row"><i className="fas fa-phone"></i><span>{escapeHtml(b.phone || '-')}</span></div>
                      <div className="bc-row"><i className="fas fa-map-marker-alt"></i><span>{escapeHtml(b.address || '-')}</span></div>
                      {b.gstNo && <div className="bc-row"><i className="fas fa-id-card"></i><span>GST: {escapeHtml(b.gstNo)}</span></div>}
                      <div className="bc-row"><i className="fas fa-crosshairs"></i><span>Location: {b.locationLat || '-'}, {b.locationLong || '-'}</span></div>
                    </div>
                  </div>
                  <h3 style={{ marginTop: 24, marginBottom: 12 }}>Edit Business</h3>
                  <div className="form-card" style={{ maxWidth: '100%' }}>
                    <form onSubmit={handleEditBusiness}>
                      <div className="form-row">
                        <div className="form-group"><label>Business Name</label><input type="text" name="editBizName" defaultValue={b.businessName || ''} required /></div>
                        <div className="form-group"><label>Phone</label><input type="text" name="editBizPhone" defaultValue={b.phone || ''} required /></div>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><label>GST No</label><input type="text" name="editBizGst" defaultValue={b.gstNo || ''} /></div>
                        <div className="form-group"><label>Address</label><input type="text" name="editBizAddress" defaultValue={b.address || ''} required /></div>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ background: vendorGradient }}>Update Business</button>
                    </form>
                    {message.id === 'bizEdit' && message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>No business registered yet. Add one below:</p>
                  <div className="form-card" style={{ maxWidth: '100%' }}>
                    <form onSubmit={handleAddBusiness}>
                      <div className="form-row">
                        <div className="form-group"><label>Business Name</label><input type="text" name="bizName" required /></div>
                        <div className="form-group"><label>Category</label>
                          <select name="bizCategory" required>
                            <option value="">Select Category</option>
                            <option value="shop">Shop</option>
                            <option value="school">School</option>
                            <option value="hospital">Hospital</option>
                            <option value="hotel">Hotel</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="private_office">Private Office</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group"><label>Description</label><textarea name="bizDesc" rows="2"></textarea></div>
                      <div className="form-row">
                        <div className="form-group"><label>Phone</label><input type="text" name="bizPhone" required /></div>
                        <div className="form-group"><label>GST No</label><input type="text" name="bizGst" /></div>
                      </div>
                      <div className="form-group"><label>Address</label><input type="text" name="bizAddress" required /></div>
                      <div className="form-group"><label>Business Photo</label><input type="file" name="bizPhoto" accept="image/*" /></div>
                      <button type="submit" className="btn btn-primary" style={{ background: vendorGradient }}>Add Business</button>
                    </form>
                    {message.id === 'bizAdd' && message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Location */}
          {activeTab === 'location' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-map-pin"></i> Update Location</h2>
              <div className="form-card">
                <form onSubmit={handleLocationSubmit}>
                  <div className="form-row">
                    <div className="form-group"><label>Latitude</label><input type="text" name="lat" required placeholder="e.g. 26.8467" /></div>
                    <div className="form-group"><label>Longitude</label><input type="text" name="lng" required placeholder="e.g. 80.9462" /></div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ background: vendorGradient }}>Update Location</button>
                </form>
                {message.id === 'location' && message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
              </div>
            </div>
          )}

          {/* Feedback */}
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
                  <button type="submit" className="btn btn-primary" style={{ background: vendorGradient }}>Submit Feedback</button>
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
