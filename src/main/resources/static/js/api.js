/* ====================================
   GeoVendor — API Service Layer
   ==================================== */

const API_BASE = '/api';

const api = {
    // ---- Auth ----
    async loginUser(email, password) {
        return post('/auth/user/login', { email, password });
    },
    async loginVendor(email, password) {
        return post('/auth/vendor/login', { email, password });
    },
    async loginAdmin(email, password) {
        return post('/auth/admin/login', { email, password });
    },

    // ---- User ----
    async registerUser(formData) {
        return postMultipart('/users/register', formData);
    },
    async checkEmail(email) {
        return get(`/users/check-email?email=${encodeURIComponent(email)}`);
    },
    async getUserProfile(email) {
        return get(`/users/${encodeURIComponent(email)}/profile`);
    },
    async updateUserProfile(email, formData) {
        return putMultipart(`/users/${encodeURIComponent(email)}/profile`, formData);
    },
    async submitUserFeedback(data) {
        return post('/users/feedback', data);
    },
    async getAllBusinesses() {
        return get('/users/businesses');
    },

    // ---- Vendor ----
    async registerVendor(formData) {
        return postMultipart('/vendors/register', formData);
    },
    async getVendorProfile(email) {
        return get(`/vendors/${encodeURIComponent(email)}/profile`);
    },
    async updateVendorProfile(email, data) {
        return put(`/vendors/${encodeURIComponent(email)}/profile`, data);
    },
    async addBusiness(email, formData) {
        return postMultipart(`/vendors/${encodeURIComponent(email)}/business`, formData);
    },
    async editBusiness(email, data) {
        return put(`/vendors/${encodeURIComponent(email)}/business`, data);
    },
    async updateLocation(email, data) {
        return put(`/vendors/${encodeURIComponent(email)}/location`, data);
    },
    async submitVendorFeedback(data) {
        return post('/vendors/feedback', data);
    },

    // ---- Admin ----
    async getUsers() { return get('/admin/users'); },
    async getVendors() { return get('/admin/vendors'); },
    async getContacts() { return get('/admin/contacts'); },
    async deleteContacts(ids) { return del('/admin/contacts', { ids }); },
    async getFeedback() { return get('/admin/feedback'); },
    async getVendorFeedback() { return get('/admin/vendor-feedback'); },
    async getRatingStats() { return get('/admin/stats/ratings'); },
    async getMonthlyContacts() { return get('/admin/stats/monthly-contacts'); },

    // ---- Guest ----
    async getHomeData() { return get('/home'); },
    async submitContact(data) { return post('/contact', data); },
};

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
