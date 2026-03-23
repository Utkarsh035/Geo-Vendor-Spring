import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function renderStars(rating) {
  if (!rating) return '';
  const count = (rating.match(/fas fa-star/g) || []).length;
  let html = '';
  for (let i = 0; i < count; i++) html += '<i class="fas fa-star"></i>';
  for (let i = count; i < 5; i++) html += '<i class="far fa-star" style="opacity:0.3"></i>';
  return html;
}

function DataTable({ headers, rows }) {
  if (!rows || rows.length === 0) {
    return <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 20 }}>No data found.</p>;
  }
  return (
    <table className="data-table">
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => {
              if (typeof cell === 'object' && cell !== null && cell.val !== undefined) {
                return <td key={ci} className={cell.cls || ''}>{cell.val || '-'}</td>;
              }
              if (typeof cell === 'string' && cell.includes('fa-star')) {
                return <td key={ci} dangerouslySetInnerHTML={{ __html: cell }}></td>;
              }
              return <td key={ci}>{cell || '-'}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const adminGradient = 'linear-gradient(135deg,#667eea,#764ba2)';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({});

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') { navigate('/admin-login'); return; }
    loadUsers();
  }, [currentUser]);

  const loadUsers = async () => {
    const res = await api.getUsers();
    if (res.success) setData((d) => ({ ...d, users: res.data || [] }));
  };

  const loadVendors = async () => {
    const res = await api.getVendors();
    if (res.success) setData((d) => ({ ...d, vendors: res.data || [] }));
  };

  const loadContacts = async () => {
    const res = await api.getContacts();
    if (res.success) setData((d) => ({ ...d, contacts: res.data || [] }));
  };

  const loadFeedback = async () => {
    const res = await api.getFeedback();
    if (res.success) setData((d) => ({ ...d, feedback: res.data || [] }));
  };

  const loadVendorFeedback = async () => {
    const res = await api.getVendorFeedback();
    if (res.success) setData((d) => ({ ...d, vendorFeedback: res.data || [] }));
  };

  const loadStats = async () => {
    const [ratingsRes, monthlyRes] = await Promise.all([api.getRatingStats(), api.getMonthlyContacts()]);
    setData((d) => ({ ...d, ratings: ratingsRes.success ? ratingsRes.data : {}, monthly: monthlyRes.success ? monthlyRes.data : {} }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'users': loadUsers(); break;
      case 'vendors': loadVendors(); break;
      case 'contacts': loadContacts(); break;
      case 'feedback': loadFeedback(); break;
      case 'vendorFeedback': loadVendorFeedback(); break;
      case 'stats': loadStats(); break;
    }
  };

  if (!currentUser) return null;

  const tabs = [
    { key: 'users', icon: 'fa-users', label: 'Users' },
    { key: 'vendors', icon: 'fa-store', label: 'Vendors' },
    { key: 'contacts', icon: 'fa-envelope', label: 'Contacts' },
    { key: 'feedback', icon: 'fa-star', label: 'Feedback' },
    { key: 'vendorFeedback', icon: 'fa-comments', label: 'Vendor FB' },
    { key: 'stats', icon: 'fa-chart-pie', label: 'Statistics' },
  ];

  return (
    <section className="page active">
      <div className="dashboard">
        <div className="dash-sidebar admin-sidebar">
          <div className="dash-profile">
            <div className="dash-avatar" style={{ background: adminGradient }}><i className="fas fa-shield-alt"></i></div>
            <h3>Admin Panel</h3>
            <p>{currentUser.email}</p>
          </div>
          <nav className="dash-nav">
            {tabs.map((t) => (
              <a key={t.key} href="#" className={`dash-link${activeTab === t.key ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); switchTab(t.key); }}>
                <i className={`fas ${t.icon}`}></i> {t.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="dash-main">
          {/* Users */}
          {activeTab === 'users' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-users"></i> All Users</h2>
              <div className="table-container">
                <DataTable
                  headers={['Name', 'Email', 'Phone', 'City', 'Registered']}
                  rows={(data.users || []).map((u) => [u.name, { val: u.email, cls: 'td-email' }, u.phone, u.city, u.date])}
                />
              </div>
            </div>
          )}

          {/* Vendors */}
          {activeTab === 'vendors' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-store"></i> All Vendors</h2>
              <div className="table-container">
                <DataTable
                  headers={['Name', 'Email', 'Phone', 'City', 'Address']}
                  rows={(data.vendors || []).map((v) => [v.name, { val: v.email, cls: 'td-email' }, v.phone, v.city, v.address])}
                />
              </div>
            </div>
          )}

          {/* Contacts */}
          {activeTab === 'contacts' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-envelope"></i> Contact Queries</h2>
              <div className="table-container">
                <DataTable
                  headers={['Name', 'Email', 'Phone', 'Query', 'Date']}
                  rows={(data.contacts || []).map((c) => [c.name, { val: c.email, cls: 'td-email' }, c.phone, c.qurey, c.date])}
                />
              </div>
            </div>
          )}

          {/* Feedback */}
          {activeTab === 'feedback' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-star"></i> User Feedback</h2>
              <div className="table-container">
                <DataTable
                  headers={['Name', 'Email', 'Rating', 'Remark', 'Date']}
                  rows={(data.feedback || []).map((f) => [f.name, { val: f.emaill, cls: 'td-email' }, renderStars(f.rating), f.remark, f.date])}
                />
              </div>
            </div>
          )}

          {/* Vendor Feedback */}
          {activeTab === 'vendorFeedback' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-comments"></i> Vendor Feedback</h2>
              <div className="table-container">
                <DataTable
                  headers={['Name', 'Email', 'Rating', 'Remark', 'Date']}
                  rows={(data.vendorFeedback || []).map((f) => [f.name, { val: f.emaill, cls: 'td-email' }, renderStars(f.rating), f.remark, f.date])}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          {activeTab === 'stats' && (
            <div className="dash-tab active">
              <h2><i className="fas fa-chart-pie"></i> Statistics</h2>
              <div className="stats-grid">
                {data.ratings && (
                  <>
                    <h3 style={{ marginBottom: 16, gridColumn: '1/-1' }}>Rating Distribution</h3>
                    {[['five_star', '⭐⭐⭐⭐⭐ Five Star'], ['four_star', '⭐⭐⭐⭐ Four Star'], ['three_star', '⭐⭐⭐ Three Star'], ['two_star', '⭐⭐ Two Star'], ['one_star', '⭐ One Star']].map(([key, label]) => (
                      <div className="stat-card" key={key}>
                        <div className="stat-value">{data.ratings[key] || 0}</div>
                        <div className="stat-label">{label}</div>
                      </div>
                    ))}
                  </>
                )}
                {data.monthly && Object.keys(data.monthly).length > 0 && (
                  <>
                    <h3 style={{ marginTop: 24, marginBottom: 16, gridColumn: '1/-1' }}>Monthly Contact Queries</h3>
                    {Object.entries(data.monthly).map(([month, count]) => (
                      <div className="stat-card" key={month}>
                        <div className="stat-value">{count}</div>
                        <div className="stat-label">{month}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
