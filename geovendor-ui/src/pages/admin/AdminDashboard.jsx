import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Store, Mail, Star, MessageSquare, PieChart, ShieldCheck, LogOut, Search } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import '../Dashboard.css';

function renderStars(rating) {
  if (!rating) return '';
  const count = (rating.match(/fas fa-star/g) || []).length;
  let html = '';
  for (let i = 0; i < count; i++) html += '<i class="fas fa-star" style="color: #f59e0b"></i>';
  for (let i = count; i < 5; i++) html += '<i class="far fa-star" style="color: #f59e0b; opacity:0.3"></i>';
  return html;
}

function DataTable({ headers, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#71717a' }}>
        <Search size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
        <p>No records found in this category.</p>
      </div>
    );
  }
  return (
    <div className="saas-table-wrapper">
      <table className="saas-table">
        <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                if (typeof cell === 'object' && cell !== null && cell.val !== undefined) return <td key={ci} style={cell.cls === 'td-email' ? { color: '#60a5fa', fontWeight: 500 } : {}}>{cell.val || '-'}</td>;
                if (typeof cell === 'string' && cell.includes('fa-star')) return <td key={ci} dangerouslySetInnerHTML={{ __html: cell }}></td>;
                return <td key={ci}>{cell || '-'}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [data, setData] = useState({});

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') { navigate('/admin-login'); return; }
    loadStats();
  }, [currentUser]);

  const loadUsers = async () => { const res = await api.getUsers(); if (res.success) setData((d) => ({ ...d, users: res.data || [] })); };
  const loadVendors = async () => { const res = await api.getVendors(); if (res.success) setData((d) => ({ ...d, vendors: res.data || [] })); };
  const loadContacts = async () => { const res = await api.getContacts(); if (res.success) setData((d) => ({ ...d, contacts: res.data || [] })); };
  const loadFeedback = async () => { const res = await api.getFeedback(); if (res.success) setData((d) => ({ ...d, feedback: res.data || [] })); };
  const loadVendorFeedback = async () => { const res = await api.getVendorFeedback(); if (res.success) setData((d) => ({ ...d, vendorFeedback: res.data || [] })); };
  const loadStats = async () => {
    const [ratingsRes, monthlyRes] = await Promise.all([api.getRatingStats(), api.getMonthlyContacts()]);
    setData((d) => ({ ...d, ratings: ratingsRes.success ? ratingsRes.data : {}, monthly: monthlyRes.success ? monthlyRes.data : {} }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'users': loadUsers(); break; case 'vendors': loadVendors(); break; case 'contacts': loadContacts(); break;
      case 'feedback': loadFeedback(); break; case 'vendorFeedback': loadVendorFeedback(); break; case 'stats': loadStats(); break;
    }
  };

  if (!currentUser) return null;

  const tabs = [
    { key: 'stats', icon: <PieChart size={18} />, label: 'Analytics' },
    { key: 'users', icon: <Users size={18} />, label: 'All Users' },
    { key: 'vendors', icon: <Store size={18} />, label: 'All Vendors' },
    { key: 'contacts', icon: <Mail size={18} />, label: 'Contact Queries' },
    { key: 'feedback', icon: <Star size={18} />, label: 'User Feedback' },
    { key: 'vendorFeedback', icon: <MessageSquare size={18} />, label: 'Vendor Feedback' },
  ];

  const renderTabContent = () => {
    if (activeTab === 'users') return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}><Users size={24} color="#60a5fa" /> Consumer Accounts</h2>
          <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>Total: {(data.users || []).length}</span>
        </div>
        <DataTable headers={['Name', 'Email', 'Phone', 'City', 'Registered']} rows={(data.users || []).map((u) => [u.name, { val: u.email, cls: 'td-email' }, u.phone, u.city, u.date])} />
      </motion.div>
    );

    if (activeTab === 'vendors') return (
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}><Store size={24} color="#60a5fa" /> Vendor Accounts</h2>
          <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>Total: {(data.vendors || []).length}</span>
        </div>
        <DataTable headers={['Name', 'Email', 'Phone', 'City', 'Address']} rows={(data.vendors || []).map((v) => [v.name, { val: v.email, cls: 'td-email' }, v.phone, v.city, v.address])} />
      </motion.div>
    );
     
    if (activeTab === 'contacts') return (
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}><Mail size={24} color="#60a5fa" /> Support Tickets</h2>
          <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>Total: {(data.contacts || []).length}</span>
        </div>
        <DataTable headers={['Name', 'Email', 'Phone', 'Query', 'Date']} rows={(data.contacts || []).map((c) => [c.name, { val: c.email, cls: 'td-email' }, c.phone, c.qurey, c.date])} />
      </motion.div>
    );

    if (activeTab === 'feedback') return (
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}><Star size={24} color="#60a5fa" /> Consumer Feedback</h2>
          <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>Total: {(data.feedback || []).length}</span>
        </div>
        <DataTable headers={['Name', 'Email', 'Rating', 'Remark', 'Date']} rows={(data.feedback || []).map((f) => [f.name, { val: f.emaill, cls: 'td-email' }, renderStars(f.rating), f.remark, f.date])} />
      </motion.div>
    );

    if (activeTab === 'vendorFeedback') return (
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}><MessageSquare size={24} color="#60a5fa" /> Vendor Feedback</h2>
          <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>Total: {(data.vendorFeedback || []).length}</span>
        </div>
        <DataTable headers={['Name', 'Email', 'Rating', 'Remark', 'Date']} rows={(data.vendorFeedback || []).map((f) => [f.name, { val: f.emaill, cls: 'td-email' }, renderStars(f.rating), f.remark, f.date])} />
      </motion.div>
    );

    if (activeTab === 'stats') return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        
        {data.ratings && (
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#f4f4f5', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}><Star size={20} color="#f59e0b" /> Platform Rating Distribution</h3>
            <div className="saas-grid">
              {[['five_star', '5 Stars', '#10b981'], ['four_star', '4 Stars', '#34d399'], ['three_star', '3 Stars', '#fbbf24'], ['two_star', '2 Stars', '#fb923c'], ['one_star', '1 Star', '#ef4444']].map(([key, label, color]) => (
                <div className="saas-card" key={key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: color, marginBottom: 4 }}>{data.ratings[key] || 0}</div>
                  <div style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.monthly && Object.keys(data.monthly).length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#f4f4f5', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}><Mail size={20} color="#60a5fa" /> Monthly Support Volume</h3>
            <div className="saas-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {Object.entries(data.monthly).map(([month, count]) => (
                <div className="saas-card" key={month} style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'white', marginBottom: 4 }}>{count}</div>
                  <div style={{ color: '#60a5fa', fontSize: '0.9rem', fontWeight: 600 }}>{month}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!data.ratings && !data.monthly) && <div style={{ color: '#71717a' }}>Loading analytics...</div>}

      </motion.div>
    );
  };

  return (
    <div className="saas-dashboard admin-mode">
      <aside className="saas-sidebar">
        <div className="saas-sidebar-header">
          <div className="saas-brand-icon"><ShieldCheck size={20} /></div>
          <span className="saas-brand-text">GeoVendor Admin</span>
        </div>
        
        <div className="saas-nav-group">
          <div className="saas-nav-label">COMMAND CENTER</div>
          {tabs.map(tab => (
             <div key={tab.key} className={`saas-nav-item ${activeTab === tab.key ? 'active' : ''}`} onClick={() => switchTab(tab.key)}>
                <span className="saas-nav-icon">{tab.icon}</span>{tab.label}
             </div>
          ))}
        </div>

        <div className="saas-sidebar-footer">
          <div className="saas-user-card">
            <div className="saas-user-avatar" style={{ background: '#1e3a8a', color: '#60a5fa' }}>
              <ShieldCheck size={20} />
            </div>
            <div className="saas-user-info">
              <div className="saas-user-name">Administrator</div>
              <div className="saas-user-role">System Access</div>
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
            <button className="saas-btn-outline" onClick={() => navigate('/')}>Home Portal</button>
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
