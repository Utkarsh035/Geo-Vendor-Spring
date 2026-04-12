const API_BASE = '/api';

// ---- HTTP Helpers ----
async function get(path) {
  const res = await fetch(API_BASE + path);
  return res.json();
}

async function post(path, data) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function put(path, data) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function del(path, data) {
  const res = await fetch(API_BASE + path, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function postMultipart(path, formData) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

async function putMultipart(path, formData) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    body: formData,
  });
  return res.json();
}

// ---- API Methods ----
const api = {
  // Auth
  loginUser: (email, password) => post('/auth/user/login', { email, password }),
  loginPartner: (email, password) => post('/auth/partner/login', { email, password }),
  loginAdmin: (email, password) => post('/auth/admin/login', { email, password }),

  // User
  registerUser: (formData) => postMultipart('/users/register', formData),
  checkEmail: (email) => get(`/users/check-email?email=${encodeURIComponent(email)}`),
  getUserProfile: (email) => get(`/users/${encodeURIComponent(email)}/profile`),
  updateUserProfile: (email, formData) => putMultipart(`/users/${encodeURIComponent(email)}/profile`, formData),
  submitUserFeedback: (data) => post('/users/feedback', data),
  getAllBusinesses: () => get('/users/businesses'),
  getBusinessDetails: (email) => get(`/users/businesses/${encodeURIComponent(email)}`),
  toggleFavorite: (email, businessEmail) => post(`/users/${encodeURIComponent(email)}/favorites/toggle/${encodeURIComponent(businessEmail)}`, {}),
  getFavoriteBusinesses: (email) => get(`/users/${encodeURIComponent(email)}/favorites`),

  // Partner
  registerPartner: (formData) => postMultipart('/partners/register', formData),
  getPartnerProfile: (email) => get(`/partners/${encodeURIComponent(email)}/profile`),
  updatePartnerProfile: (email, data) => put(`/partners/${encodeURIComponent(email)}/profile`, data),
  addBusiness: (email, formData) => postMultipart(`/partners/${encodeURIComponent(email)}/business`, formData),
  editBusiness: (email, data) => put(`/partners/${encodeURIComponent(email)}/business`, data),
  updateLocation: (email, data) => put(`/partners/${encodeURIComponent(email)}/location`, data),
  updateBusinessStatus: (email, isActive) => put(`/partners/${encodeURIComponent(email)}/status`, { isActive }),
  submitPartnerFeedback: (data) => post('/partners/feedback', data),

  // Admin
  getUsers: () => get('/admin/users'),
  getPartners: () => get('/admin/partners'),
  getContacts: () => get('/admin/contacts'),
  deleteContacts: (ids) => del('/admin/contacts', { ids }),
  getFeedback: () => get('/admin/feedback'),
  getPartnerFeedback: () => get('/admin/partner-feedback'),
  getRatingStats: () => get('/admin/stats/ratings'),
  getMonthlyContacts: () => get('/admin/stats/monthly-contacts'),

  // Guest
  getHomeData: () => get('/home'),
  submitContact: (data) => post('/contact', data),
};

export default api;
