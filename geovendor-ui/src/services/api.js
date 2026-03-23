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
  loginVendor: (email, password) => post('/auth/vendor/login', { email, password }),
  loginAdmin: (email, password) => post('/auth/admin/login', { email, password }),

  // User
  registerUser: (formData) => postMultipart('/users/register', formData),
  checkEmail: (email) => get(`/users/check-email?email=${encodeURIComponent(email)}`),
  getUserProfile: (email) => get(`/users/${encodeURIComponent(email)}/profile`),
  updateUserProfile: (email, formData) => putMultipart(`/users/${encodeURIComponent(email)}/profile`, formData),
  submitUserFeedback: (data) => post('/users/feedback', data),
  getAllBusinesses: () => get('/users/businesses'),

  // Vendor
  registerVendor: (formData) => postMultipart('/vendors/register', formData),
  getVendorProfile: (email) => get(`/vendors/${encodeURIComponent(email)}/profile`),
  updateVendorProfile: (email, data) => put(`/vendors/${encodeURIComponent(email)}/profile`, data),
  addBusiness: (email, formData) => postMultipart(`/vendors/${encodeURIComponent(email)}/business`, formData),
  editBusiness: (email, data) => put(`/vendors/${encodeURIComponent(email)}/business`, data),
  updateLocation: (email, data) => put(`/vendors/${encodeURIComponent(email)}/location`, data),
  submitVendorFeedback: (data) => post('/vendors/feedback', data),

  // Admin
  getUsers: () => get('/admin/users'),
  getVendors: () => get('/admin/vendors'),
  getContacts: () => get('/admin/contacts'),
  deleteContacts: (ids) => del('/admin/contacts', { ids }),
  getFeedback: () => get('/admin/feedback'),
  getVendorFeedback: () => get('/admin/vendor-feedback'),
  getRatingStats: () => get('/admin/stats/ratings'),
  getMonthlyContacts: () => get('/admin/stats/monthly-contacts'),

  // Guest
  getHomeData: () => get('/home'),
  submitContact: (data) => post('/contact', data),
};

export default api;
