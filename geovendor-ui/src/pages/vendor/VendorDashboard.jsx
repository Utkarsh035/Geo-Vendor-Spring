import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit3, Briefcase, MapPin, Star, DoorOpen, DoorClosed, Play, StopCircle, Info, Phone, CreditCard, Crosshair, Satellite, Store, LogOut, FileImage } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/StarRating';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import '../Dashboard.css';

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition({ lat: e.latlng.lat, lng: e.latlng.lng }); } });
  return position ? <Marker position={position} /> : null;
}

function escapeHtml(str) { if (!str) return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

export default function VendorDashboard() {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('business');
  
  const [vendorData, setVendorData] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [fbRating, setFbRating] = useState('');
  const [message, setMessage] = useState({ id: '', text: '', type: '' });
  const [locationMode, setLocationMode] = useState('manual');
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [lastLiveUpdate, setLastLiveUpdate] = useState(null);
  const [manualLoc, setManualLoc] = useState(null);
  
  const liveIntervalRef = useRef(null);

  useEffect(() => {
    if (vendorData?.business?.locationLat && vendorData?.business?.locationLong) {
      setManualLoc({ lat: parseFloat(vendorData.business.locationLat), lng: parseFloat(vendorData.business.locationLong) });
    } else { setManualLoc({ lat: 26.8467, lng: 80.9462 }); }
  }, [vendorData]);

  useEffect(() => { return () => { if (liveIntervalRef.current) clearInterval(liveIntervalRef.current); }; }, []);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await api.updateVendorProfile(currentUser.email, editForm);
    if (res.success) { showToast('Profile updated!'); setMessage({ id: 'edit', text: 'Profile updated successfully', type: 'success' }); loadProfile(); }
    else { setMessage({ id: 'edit', text: res.message, type: 'error' }); }
  };

  const handleAddBusiness = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();
    fd.append('name', form.bizName.value); fd.append('category', form.bizCategory.value); fd.append('description', form.bizDesc.value); fd.append('phone', form.bizPhone.value); fd.append('gst', form.bizGst.value); fd.append('address', form.bizAddress.value);
    if (form.bizPhoto?.files[0]) fd.append('businessPhoto', form.bizPhoto.files[0]);
    const res = await api.addBusiness(currentUser.email, fd);
    if (res.success) { showToast('Business added!'); loadProfile(); } else { setMessage({ id: 'bizAdd', text: res.message, type: 'error' }); }
  };

  const handleEditBusiness = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { name: form.editBizName.value, phone: form.editBizPhone.value, gst: form.editBizGst.value, address: form.editBizAddress.value };
    const res = await api.editBusiness(currentUser.email, data);
    if (res.success) { showToast('Business updated!'); setMessage({ id: 'bizEdit', text: 'Business updated successfully', type: 'success' }); loadProfile(); }
    else { setMessage({ id: 'bizEdit', text: res.message, type: 'error' }); }
  };

  const handleToggleStatus = async () => {
    const isCurrentlyActive = b?.isActive !== false;
    if (!b) return;
    const res = await api.updateBusinessStatus(currentUser.email, !isCurrentlyActive);
    if (res.success) { showToast(isCurrentlyActive ? 'Business marked as closed' : 'Business opened'); loadProfile(); }
    else { showToast(res.message, 'error'); }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (!manualLoc) { setMessage({ id: 'location', text: 'Please pick a location on the map first', type: 'error' }); return; }
    const data = { lat: manualLoc.lat.toFixed(6), lng: manualLoc.lng.toFixed(6) };
    const res = await api.updateLocation(currentUser.email, data);
    if (res.success) { showToast('Location updated!'); setMessage({ id: 'location', text: 'Location updated successfully', type: 'success' }); loadProfile(); }
    else { setMessage({ id: 'location', text: res.message, type: 'error' }); }
  };

  const updateLiveLocation = () => {
    if (!navigator.geolocation) { setMessage({ id: 'location', text: 'Geolocation is not supported', type: 'error' }); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const data = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const res = await api.updateLocation(currentUser.email, data);
        if (res.success) { setLastLiveUpdate(new Date().toLocaleTimeString()); loadProfile(); } 
        else { setMessage({ id: 'location', text: 'Auto-update failed: ' + res.message, type: 'error' }); }
      },
      () => { setMessage({ id: 'location', text: 'Location access denied.', type: 'error' }); stopLiveTracking(); },
      { enableHighAccuracy: true }
    );
  };

  const startLiveTracking = () => { setIsLiveTracking(true); setMessage({ id: 'location', text: 'Live tracking started', type: 'success' }); updateLiveLocation(); liveIntervalRef.current = setInterval(updateLiveLocation, 8000); };
  const stopLiveTracking = () => { if (liveIntervalRef.current) clearInterval(liveIntervalRef.current); liveIntervalRef.current = null; setIsLiveTracking(false); setMessage({ id: 'location', text: 'Live tracking stopped', type: 'success' }); };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { name: form.fbName.value, email: form.fbEmail.value, rating: fbRating, remark: form.fbRemark.value };
    if (!data.rating) { showToast('Please select a rating', 'error'); return; }
    const res = await api.submitVendorFeedback(data);
    if (res.success) { showToast('Feedback submitted!'); setMessage({ id: 'feedback', text: res.message, type: 'success' }); form.reset(); setFbRating(''); }
    else { setMessage({ id: 'feedback', text: res.message, type: 'error' }); }
  };

  if (!currentUser) return null;
  const v = vendorData?.vendor;
  const b = vendorData?.business;

  const tabs = [
    { key: 'business', icon: <Briefcase size={18} />, label: 'Manage Business' },
    { key: 'location', icon: <MapPin size={18} />, label: 'GPS Location' },
    { key: 'profile', icon: <User size={18} />, label: 'Vendor Profile' },
    { key: 'feedback', icon: <Star size={18} />, label: 'Submit Feedback' },
  ];

  const renderTabContent = () => {
    if (activeTab === 'business') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {b ? (
            <>
              {/* Business Overview Card */}
              <div className="saas-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: b.isActive === false ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #ec4899, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.isActive === false ? '#71717a' : 'white', fontSize: '1.8rem', boxShadow: b.isActive === false ? 'none' : '0 8px 30px rgba(236,72,153,0.3)' }}>
                      <i className={b.businessIcon || 'fas fa-store'}></i>
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: b.isActive === false ? '#a1a1aa' : '#f4f4f5' }}>{escapeHtml(b.businessName)}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                        <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.1)' }}>{escapeHtml(b.businessCategory)}</span>
                        {b.isActive === false ? 
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: '0.85rem', fontWeight: 600 }}><DoorClosed size={14} /> CLOSED</span> : 
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}><DoorOpen size={14} /> ACCEPTING CUSTOMERS</span>
                        }
                      </div>
                    </div>
                  </div>
                  <button onClick={handleToggleStatus} style={{ padding: '10px 20px', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none', transition: 'all 0.2s', ...(b.isActive === false ? { background: '#10b981', color: 'white', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' } : { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }) }}>
                    {b.isActive === false ? <><DoorOpen size={16} /> Open Business</> : <><DoorClosed size={16} /> Close Business</>}
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, opacity: b.isActive === false ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', gap: 12, color: '#a1a1aa' }}><Info size={18} className="vendor-mode" style={{ color: '#f472b6' }} /><div><div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 4 }}>Description</div><div style={{ color: '#f4f4f5', fontSize: '0.9rem' }}>{escapeHtml(b.description || '-')}</div></div></div>
                  <div style={{ display: 'flex', gap: 12, color: '#a1a1aa' }}><Phone size={18} className="vendor-mode" style={{ color: '#f472b6' }} /><div><div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 4 }}>Phone</div><div style={{ color: '#f4f4f5', fontSize: '0.9rem' }}>{escapeHtml(b.phone || '-')}</div></div></div>
                  <div style={{ display: 'flex', gap: 12, color: '#a1a1aa' }}><CreditCard size={18} className="vendor-mode" style={{ color: '#f472b6' }} /><div><div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 4 }}>GST No</div><div style={{ color: '#f4f4f5', fontSize: '0.9rem' }}>{escapeHtml(b.gstNo || '-')}</div></div></div>
                  <div style={{ display: 'flex', gap: 12, color: '#a1a1aa', gridColumn: '1 / -1' }}><MapPin size={18} className="vendor-mode" style={{ color: '#f472b6' }} /><div><div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 4 }}>Registered Address</div><div style={{ color: '#f4f4f5', fontSize: '0.9rem' }}>{escapeHtml(b.address || '-')}</div></div></div>
                </div>
              </div>

              {/* Edit Business Form */}
              <div className="saas-card" style={{ opacity: b.isActive === false ? 0.5 : 1, pointerEvents: b.isActive === false ? 'none' : 'auto' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 24, color: '#f4f4f5' }}>Update Details</h3>
                <form onSubmit={handleEditBusiness}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="saas-form-group"><label>Business Name</label><input type="text" name="editBizName" defaultValue={b.businessName || ''} required /></div>
                    <div className="saas-form-group"><label>Phone</label><input type="text" name="editBizPhone" defaultValue={b.phone || ''} required /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: 16 }}>
                    <div className="saas-form-group"><label>GST No (Optional)</label><input type="text" name="editBizGst" defaultValue={b.gstNo || ''} /></div>
                    <div className="saas-form-group"><label>Address</label><input type="text" name="editBizAddress" defaultValue={b.address || ''} required /></div>
                  </div>
                  <button type="submit" className="saas-btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', border: 'none' }}>Save Updates</button>
                  {message.id === 'bizEdit' && <div style={{ marginTop: 16, color: message.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>{message.text}</div>}
                </form>
              </div>
            </>
          ) : (
            <div className="saas-card" style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '60px 40px' }}>
               <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#f472b6' }}><Store size={40} /></div>
               <h2 style={{ fontSize: '1.8rem', color: '#f4f4f5', marginBottom: 12 }}>Register Your Business</h2>
               <p style={{ color: '#a1a1aa', fontSize: '1.05rem', marginBottom: 40 }}>Add your business details below to start appearing on the map for thousands of local users.</p>
               
               <form onSubmit={handleAddBusiness} style={{ textAlign: 'left' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="saas-form-group"><label>Business Name</label><input type="text" name="bizName" required /></div>
                    <div className="saas-form-group"><label>Category</label>
                      <select name="bizCategory" required>
                        <option value="">Select Category</option>
                        <option value="shop">Shop</option><option value="school">School</option><option value="hospital">Hospital</option>
                        <option value="hotel">Hotel</option><option value="restaurant">Restaurant</option><option value="private_office">Private Office</option><option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="saas-form-group"><label>Description</label><textarea name="bizDesc" rows="2" placeholder="Tell customers about what you do..."></textarea></div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: 16 }}>
                    <div className="saas-form-group"><label>Contact Phone</label><input type="text" name="bizPhone" required /></div>
                    <div className="saas-form-group"><label>GST No (Optional)</label><input type="text" name="bizGst" /></div>
                  </div>
                  <div className="saas-form-group"><label>Full Address</label><input type="text" name="bizAddress" required /></div>
                  <div className="saas-form-group"><label>Business Photo</label><input type="file" name="bizPhoto" accept="image/*" style={{ padding: 8 }} /></div>
                  
                  <button type="submit" className="saas-btn-primary" style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', border: 'none', fontSize: '1.05rem', marginTop: 12, boxShadow: '0 8px 25px rgba(236,72,153,0.3)' }}>List Business</button>
                  {message.id === 'bizAdd' && <div style={{ marginTop: 16, textAlign: 'center', color: '#ef4444' }}>{message.text}</div>}
               </form>
            </div>
          )}
        </motion.div>
      );
    }
    
    if (activeTab === 'location') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {b?.isActive === false ? (
            <div className="saas-card" style={{ textAlign: 'center', padding: '100px 40px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#ef4444' }}><DoorClosed size={40} /></div>
              <h2 style={{ fontSize: '1.8rem', color: '#f4f4f5', marginBottom: 12 }}>Business is Closed</h2>
              <p style={{ color: '#a1a1aa', fontSize: '1.05rem', maxWidth: 400, margin: '0 auto' }}>Your location is currently hidden from the live map. Open your business from the Manage Business tab to broadcast your location.</p>
            </div>
          ) : (
            <div className="saas-card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: '1.5rem', color: '#f4f4f5', marginBottom: 8 }}>Update GPS Position</h2>
              <p style={{ color: '#a1a1aa', marginBottom: 32 }}>Choose how you want customers to find your current location.</p>
              
              <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <button type="button" onClick={() => { setLocationMode('manual'); setMessage({ id: '', text: '', type: '' }); }} style={{ flex: 1, padding: '24px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', border: locationMode === 'manual' ? '2px solid #ec4899' : '1px solid rgba(255,255,255,0.08)', background: locationMode === 'manual' ? 'rgba(236,72,153,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                  <MapPin size={32} color={locationMode === 'manual' ? '#f472b6' : '#a1a1aa'} />
                  <div style={{ color: locationMode === 'manual' ? '#f4f4f5' : '#a1a1aa', fontWeight: 600, fontSize: '1.1rem' }}>Manual Pin Drop</div>
                  <div style={{ color: '#71717a', fontSize: '0.85rem', textAlign: 'center' }}>Click on the map to set a fixed location. Best for permanent storefronts.</div>
                </button>
                <button type="button" onClick={() => { setLocationMode('live'); setMessage({ id: '', text: '', type: '' }); }} style={{ flex: 1, padding: '24px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', border: locationMode === 'live' ? '2px solid #ec4899' : '1px solid rgba(255,255,255,0.08)', background: locationMode === 'live' ? 'rgba(236,72,153,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                  <Satellite size={32} color={locationMode === 'live' ? '#f472b6' : '#a1a1aa'} />
                  <div style={{ color: locationMode === 'live' ? '#f4f4f5' : '#a1a1aa', fontWeight: 600, fontSize: '1.1rem' }}>Live GPS Tracking</div>
                  <div style={{ color: '#71717a', fontSize: '0.85rem', textAlign: 'center' }}>Auto-update every 8s from your device. Best for food trucks or moving services.</div>
                </button>
              </div>

              {locationMode === 'manual' ? (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', color: '#e4e4e7', marginBottom: 4 }}>Fixed Map Location</h3>
                      <div style={{ fontSize: '0.85rem', color: '#71717a' }}>Drag, zoom, and click to drop a pin.</div>
                    </div>
                    {manualLoc && <div style={{ fontSize: '0.85rem', color: '#f472b6', fontWeight: 600, background: 'rgba(236,72,153,0.1)', padding: '4px 12px', borderRadius: 20 }}>{manualLoc.lat.toFixed(6)}, {manualLoc.lng.toFixed(6)}</div>}
                  </div>
                  <div style={{ height: 400, width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24, zIndex: 1 }}>
                    {manualLoc && (
                      <MapContainer center={[manualLoc.lat, manualLoc.lng]} zoom={13} style={{ height: '100%', width: '100%', filter: 'invert(90%) hue-rotate(180deg) brightness(80%)' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' />
                        <LocationPicker position={manualLoc} setPosition={setManualLoc} />
                      </MapContainer>
                    )}
                  </div>
                  <button onClick={handleLocationSubmit} className="saas-btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', border: 'none' }}>Broadcast Pinned Location</button>
                  {message.id === 'location' && <span style={{ marginLeft: 16, color: message.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>{message.text}</span>}
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
                  {isLiveTracking ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                      <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto 20px' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', opacity: 0.2, animation: 'marker-pulse 2s infinite ease-out' }}></div>
                        <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Satellite size={24} /></div>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', color: '#10b981', marginBottom: 8, fontWeight: 700 }}>Broadcasting Live</h3>
                      <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Your device is securely sending GPS data every 8 seconds.</p>
                      <div style={{ marginTop: 16, display: 'inline-block', background: 'black', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#e4e4e7' }}>Last sync: {lastLiveUpdate || 'connecting...'}</div>
                    </motion.div>
                  ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                      <Satellite size={48} color="#71717a" style={{ marginBottom: 20 }} />
                      <h3 style={{ fontSize: '1.2rem', color: '#f4f4f5', marginBottom: 8 }}>Tracking Paused</h3>
                      <p style={{ color: '#71717a', fontSize: '0.9rem' }}>Enable this mode when you are moving to automatically update customers with your exact coordinates.</p>
                    </div>
                  )}

                  {isLiveTracking ? (
                    <button onClick={stopLiveTracking} className="saas-btn-primary" style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}><StopCircle size={18} /> Stop Broadcasting</button>
                  ) : (
                    <button onClick={startLiveTracking} className="saas-btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}><Play size={18} /> Activate Live GPS Output</button>
                  )}
                  {message.id === 'location' && !isLiveTracking && <div style={{ marginTop: 24, padding: '12px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', display: 'inline-block' }}>{message.text}</div>}
                </div>
              )}
            </div>
          )}
        </motion.div>
      );
    }
    
    if (activeTab === 'profile') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 32 }}>
          <div className="saas-card" style={{ alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 20, color: '#f4f4f5' }}>Owner Information</h3>
            {!v ? <div style={{ color: '#71717a' }}>Loading...</div> : (
              <div>
                {v.profilePic && (
                  <div style={{ width: 80, height: 80, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(236,72,153,0.3)', marginBottom: 24 }}>
                    <img src={`/${v.profilePic.replace(/\\\\/g, '/')}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4 }}>Name</div><div style={{ color: '#e4e4e7', fontWeight: 500 }}>{escapeHtml(v.name)}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4 }}>Email</div><div style={{ color: '#f472b6', fontWeight: 500 }}>{escapeHtml(v.email)}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4 }}>Phone</div><div style={{ color: '#e4e4e7' }}>{escapeHtml(v.phone)}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', marginBottom: 4 }}>Location</div><div style={{ color: '#e4e4e7' }}>{escapeHtml(v.address)}, {escapeHtml(v.city)}</div></div>
                </div>
              </div>
            )}
          </div>
          <div className="saas-card" style={{ alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 20, color: '#f4f4f5' }}>Update Personal Details</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="saas-form-group"><label>Full Name</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></div>
                <div className="saas-form-group"><label>Phone Number</label><input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="saas-form-group"><label>City</label><input type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} required /></div>
                <div className="saas-form-group"><label>Address</label><input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} required /></div>
              </div>
              <button type="submit" className="saas-btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', border: 'none', marginTop: 8 }}>Save Owner Profile</button>
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
            <h3 style={{ fontSize: '1.2rem', marginBottom: 4, color: '#f4f4f5' }}>Partner Feedback</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: 24 }}>How can we improve the GeoVendor platform for your business operations?</p>
            
            <form onSubmit={handleFeedbackSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="saas-form-group"><label>Name</label><input type="text" name="fbName" defaultValue={v?.name || ''} required /></div>
                <div className="saas-form-group"><label>Email</label><input type="email" name="fbEmail" defaultValue={v?.email || ''} required /></div>
              </div>
              <div className="saas-form-group">
                <label>Platform Rating</label>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: 12, borderRadius: 8 }}>
                  <StarRating value={fbRating} onChange={setFbRating} />
                </div>
              </div>
              <div className="saas-form-group"><label>Comments / Suggestions</label><textarea name="fbRemark" rows="4" placeholder="Report bugs, suggest features, etc..." required></textarea></div>
              <button type="submit" className="saas-btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white', border: 'none' }}>Submit Vendor Review</button>
              {message.id === 'feedback' && <div style={{ marginTop: 16, color: message.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>{message.text}</div>}
            </form>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="saas-dashboard vendor-mode">
      <aside className="saas-sidebar">
        <div className="saas-sidebar-header">
          <div className="saas-brand-icon"><MapPin size={20} /></div>
          <span className="saas-brand-text">GeoVendor</span>
        </div>
        
        <div className="saas-nav-group">
          <div className="saas-nav-label">SELLER HUB</div>
          {tabs.map(tab => (
             <div key={tab.key} className={`saas-nav-item ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
                <span className="saas-nav-icon">{tab.icon}</span>{tab.label}
             </div>
          ))}
        </div>

        <div className="saas-sidebar-footer">
          <div className="saas-user-card">
            <div className="saas-user-avatar">
              {v?.profilePic ? <img src={`/${v.profilePic.replace(/\\\\/g, '/')}`} alt="" /> : <Store size={20} color="#71717a" />}
            </div>
            <div className="saas-user-info">
              <div className="saas-user-name">{v?.name || 'Vendor'}</div>
              <div className="saas-user-role">Business Partner</div>
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
      </main>
    </div>
  );
}
