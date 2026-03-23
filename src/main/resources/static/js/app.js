/* ====================================
   GeoVendor — Main Application Logic
   ==================================== */

// ---- Session State ----
let currentUser = JSON.parse(localStorage.getItem('geovendor_user') || 'null');

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    const hash = window.location.hash.slice(1) || 'home';
    navigate(hash, false);
    if (hash === 'home') loadHomePage();
});

// ---- Navigation ----
function navigate(page, pushState = true) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Close mobile nav
    document.getElementById('navLinks').classList.remove('open');

    // Show/hide footer for dashboard pages
    const footer = document.getElementById('mainFooter');
    if (page.includes('dashboard')) {
        footer.style.display = 'none';
    } else {
        footer.style.display = '';
    }

    if (pushState) window.location.hash = page;

    // Load data for specific pages
    switch (page) {
        case 'home': loadHomePage(); break;
        case 'user-dashboard': loadUserDashboard(); break;
        case 'vendor-dashboard': loadVendorDashboard(); break;
        case 'admin-dashboard': loadAdminDashboard(); break;
    }

    window.scrollTo(0, 0);
}

function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
}

function updateNavbar() {
    const userLoginBtn = document.getElementById('navUserLogin');
    const vendorLoginBtn = document.getElementById('navVendorLogin');
    const adminLoginBtn = document.getElementById('navAdminLogin');
    const logoutBtn = document.getElementById('navLogout');
    const loggedInLinks = document.querySelectorAll('.logged-in-link');

    if (currentUser) {
        userLoginBtn.style.display = 'none';
        vendorLoginBtn.style.display = 'none';
        adminLoginBtn.style.display = 'none';
        logoutBtn.style.display = '';

        // Show role-specific dashboard link
        document.querySelectorAll('.user-link,.vendor-link,.admin-link').forEach(el => el.style.display = 'none');
        if (currentUser.role === 'user') {
            document.querySelector('.user-link').style.display = '';
        } else if (currentUser.role === 'vendor') {
            document.querySelector('.vendor-link').style.display = '';
        } else if (currentUser.role === 'admin') {
            document.querySelector('.admin-link').style.display = '';
        }
    } else {
        userLoginBtn.style.display = '';
        vendorLoginBtn.style.display = '';
        adminLoginBtn.style.display = '';
        logoutBtn.style.display = 'none';
        loggedInLinks.forEach(el => el.style.display = 'none');
    }
}

// ---- Toast Notifications ----
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showFormMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.className = 'form-message ' + type;
    el.textContent = message;
}

// ---- Home Page ----
async function loadHomePage() {
    try {
        const res = await api.getHomeData();
        if (res.success) {
            const container = document.getElementById('homeFeedbacks');
            const allFeedbacks = [];

            (res.data.userFeedbacks || []).forEach(u => {
                if (u.fd) allFeedbacks.push({ name: u.fd.name, rating: u.fd.rating, remark: u.fd.remark, pic: u.profilePic });
            });
            (res.data.vendorFeedbacks || []).forEach(v => {
                if (v.vf) allFeedbacks.push({ name: v.vf.name, rating: v.vf.rating, remark: v.vf.remark, pic: v.profilePic });
            });

            if (allFeedbacks.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-secondary)">No feedbacks yet.</p>';
                return;
            }

            container.innerHTML = allFeedbacks.map(fb => `
                <div class="feedback-card">
                    <div class="fc-header">
                        <div class="fc-avatar">
                            ${fb.pic ? `<img src="/${fb.pic.replace(/\\\\/g, '/')}" alt="">` : '<i class="fas fa-user" style="color:#fff"></i>'}
                        </div>
                        <div>
                            <div class="fc-name">${escapeHtml(fb.name)}</div>
                            <div class="fc-stars">${renderStars(fb.rating)}</div>
                        </div>
                    </div>
                    <p class="fc-remark">"${escapeHtml(fb.remark || '')}"</p>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

function renderStars(rating) {
    if (!rating) return '';
    const count = (rating.match(/fas fa-star/g) || []).length;
    let html = '';
    for (let i = 0; i < count; i++) html += '<i class="fas fa-star"></i>';
    for (let i = count; i < 5; i++) html += '<i class="far fa-star" style="opacity:0.3"></i>';
    return html;
}

// ---- Contact ----
async function submitContact(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        query: document.getElementById('contactQuery').value,
    };
    const res = await api.submitContact(data);
    if (res.success) {
        showFormMessage('contactMessage', res.message, 'success');
        showToast(res.message);
        document.getElementById('contactForm').reset();
    } else {
        showFormMessage('contactMessage', res.message, 'error');
    }
}

// ---- User Auth ----
async function loginUser(e) {
    e.preventDefault();
    const email = document.getElementById('userLoginEmail').value;
    const password = document.getElementById('userLoginPassword').value;
    const res = await api.loginUser(email, password);
    if (res.success) {
        currentUser = res.data;
        localStorage.setItem('geovendor_user', JSON.stringify(currentUser));
        updateNavbar();
        showToast('Welcome back!');
        navigate('user-dashboard');
    } else {
        showFormMessage('userLoginMessage', res.message, 'error');
    }
}

async function registerUser(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', document.getElementById('regUserName').value);
    fd.append('phone', document.getElementById('regUserPhone').value);
    fd.append('email', document.getElementById('regUserEmail').value);
    fd.append('password', document.getElementById('regUserPassword').value);
    fd.append('city', document.getElementById('regUserCity').value);
    fd.append('address', document.getElementById('regUserAddress').value);
    const fileInput = document.getElementById('regUserPic');
    if (fileInput.files[0]) fd.append('profilePic', fileInput.files[0]);

    const res = await api.registerUser(fd);
    if (res.success) {
        showToast('Registration successful! Please login.');
        navigate('user-login');
    } else {
        showFormMessage('userRegisterMessage', res.message, 'error');
    }
}

// ---- Vendor Auth ----
async function loginVendor(e) {
    e.preventDefault();
    const email = document.getElementById('vendorLoginEmail').value;
    const password = document.getElementById('vendorLoginPassword').value;
    const res = await api.loginVendor(email, password);
    if (res.success) {
        currentUser = res.data;
        localStorage.setItem('geovendor_user', JSON.stringify(currentUser));
        updateNavbar();
        showToast('Welcome back!');
        navigate('vendor-dashboard');
    } else {
        showFormMessage('vendorLoginMessage', res.message, 'error');
    }
}

async function registerVendor(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', document.getElementById('regVendorName').value);
    fd.append('phone', document.getElementById('regVendorPhone').value);
    fd.append('email', document.getElementById('regVendorEmail').value);
    fd.append('password', document.getElementById('regVendorPassword').value);
    fd.append('city', document.getElementById('regVendorCity').value);
    fd.append('address', document.getElementById('regVendorAddress').value);
    const fileInput = document.getElementById('regVendorPic');
    if (fileInput.files[0]) fd.append('profilePic', fileInput.files[0]);

    const res = await api.registerVendor(fd);
    if (res.success) {
        showToast('Registration successful! Please login.');
        navigate('vendor-login');
    } else {
        showFormMessage('vendorRegisterMessage', res.message, 'error');
    }
}

// ---- Admin Auth ----
async function loginAdmin(e) {
    e.preventDefault();
    const email = document.getElementById('adminLoginEmail').value;
    const password = document.getElementById('adminLoginPassword').value;
    const res = await api.loginAdmin(email, password);
    if (res.success) {
        currentUser = res.data;
        localStorage.setItem('geovendor_user', JSON.stringify(currentUser));
        updateNavbar();
        showToast('Admin access granted');
        navigate('admin-dashboard');
    } else {
        showFormMessage('adminLoginMessage', res.message, 'error');
    }
}

// ---- Logout ----
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('geovendor_user');
    updateNavbar();
    showToast('Logged out successfully');
    navigate('home');
}

// ---- Star Rating ----
function setRating(type, value) {
    const container = document.getElementById(type + 'StarRating');
    const hidden = document.getElementById('fb' + capitalize(type) + 'Rating');
    const stars = container.querySelectorAll('i');
    const ratingString = Array(value).fill('fas fa-star').join(',');
    hidden.value = ratingString;
    stars.forEach((star, idx) => {
        star.classList.toggle('active', idx < value);
    });
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ---- Dashboard Tab Switching ----
function showDashTab(tabName) {
    // Find the parent dashboard
    const tab = document.getElementById('tab-' + tabName);
    if (!tab) return;
    const dash = tab.closest('.dashboard');
    dash.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update sidebar active state
    dash.querySelectorAll('.dash-link').forEach(l => l.classList.remove('active'));
    event.target.closest('.dash-link').classList.add('active');

    // Load data
    switch (tabName) {
        case 'userProfile': loadUserProfile(); break;
        case 'userEdit': loadUserEditForm(); break;
        case 'userMap': loadBusinesses(); break;
        case 'vendorProfile': loadVendorProfile(); break;
        case 'vendorEdit': loadVendorEditForm(); break;
        case 'vendorBusiness': loadVendorBusiness(); break;
        case 'adminUsers': loadAdminUsers(); break;
        case 'adminVendors': loadAdminVendors(); break;
        case 'adminContacts': loadAdminContacts(); break;
        case 'adminFeedback': loadAdminFeedback(); break;
        case 'adminVendorFeedback': loadAdminVendorFeedback(); break;
        case 'adminStats': loadAdminStats(); break;
    }
}

// ---- User Dashboard ----
async function loadUserDashboard() {
    if (!currentUser || currentUser.role !== 'user') { navigate('user-login'); return; }
    document.getElementById('userDashEmail').textContent = currentUser.email;
    loadUserProfile();
}

async function loadUserProfile() {
    if (!currentUser) return;
    const res = await api.getUserProfile(currentUser.email);
    if (res.success) {
        const u = res.data;
        document.getElementById('userDashName').textContent = u.name || 'User';
        document.getElementById('userProfileDetails').innerHTML = `
            ${u.profilePic ? `<div class="profile-pic-large"><img src="/${u.profilePic.replace(/\\\\/g, '/')}" alt="Profile"></div>` : ''}
            <div class="profile-row"><span class="pr-label">Name</span><span class="pr-value">${escapeHtml(u.name)}</span></div>
            <div class="profile-row"><span class="pr-label">Email</span><span class="pr-value" style="color:var(--accent)">${escapeHtml(u.email)}</span></div>
            <div class="profile-row"><span class="pr-label">Phone</span><span class="pr-value">${escapeHtml(u.phone || '-')}</span></div>
            <div class="profile-row"><span class="pr-label">City</span><span class="pr-value">${escapeHtml(u.city || '-')}</span></div>
            <div class="profile-row"><span class="pr-label">Address</span><span class="pr-value">${escapeHtml(u.address || '-')}</span></div>
            <div class="profile-row"><span class="pr-label">Registered</span><span class="pr-value">${u.date || '-'}</span></div>
        `;
    }
}

async function loadUserEditForm() {
    if (!currentUser) return;
    const res = await api.getUserProfile(currentUser.email);
    if (res.success) {
        const u = res.data;
        document.getElementById('editUserName').value = u.name || '';
        document.getElementById('editUserPhone').value = u.phone || '';
        document.getElementById('editUserCity').value = u.city || '';
        document.getElementById('editUserAddress').value = u.address || '';
    }
}

async function updateUserProfile(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', document.getElementById('editUserName').value);
    fd.append('phone', document.getElementById('editUserPhone').value);
    fd.append('city', document.getElementById('editUserCity').value);
    fd.append('address', document.getElementById('editUserAddress').value);
    const fileInput = document.getElementById('editUserPic');
    if (fileInput.files[0]) fd.append('profilePic', fileInput.files[0]);

    const res = await api.updateUserProfile(currentUser.email, fd);
    if (res.success) {
        showToast('Profile updated!');
        showFormMessage('userEditMessage', 'Profile updated successfully', 'success');
    } else {
        showFormMessage('userEditMessage', res.message, 'error');
    }
}

async function loadBusinesses() {
    const res = await api.getAllBusinesses();
    if (res.success) {
        const grid = document.getElementById('businessGrid');
        const businesses = res.data || [];
        if (businesses.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:var(--text-secondary)">No businesses registered yet.</p>';
            return;
        }
        grid.innerHTML = businesses.map(b => `
            <div class="business-card">
                <div class="bc-header">
                    <div class="bc-icon"><i class="${b.businessIcon || 'fas fa-store'}"></i></div>
                    <div>
                        <div class="bc-name">${escapeHtml(b.businessName || '')}</div>
                        <span class="bc-category">${escapeHtml(b.businessCategory || '')}</span>
                    </div>
                </div>
                <div class="bc-details">
                    ${b.description ? `<div class="bc-row"><i class="fas fa-info-circle"></i><span>${escapeHtml(b.description)}</span></div>` : ''}
                    <div class="bc-row"><i class="fas fa-phone"></i><span>${escapeHtml(b.phone || '-')}</span></div>
                    <div class="bc-row"><i class="fas fa-map-marker-alt"></i><span>${escapeHtml(b.address || '-')}</span></div>
                    ${b.gstNo ? `<div class="bc-row"><i class="fas fa-id-card"></i><span>GST: ${escapeHtml(b.gstNo)}</span></div>` : ''}
                </div>
            </div>
        `).join('');
    }
}

async function submitUserFeedback(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('fbUserName').value,
        email: document.getElementById('fbUserEmail').value,
        rating: document.getElementById('fbUserRating').value,
        remark: document.getElementById('fbUserRemark').value,
    };
    if (!data.rating) { showToast('Please select a rating', 'error'); return; }
    const res = await api.submitUserFeedback(data);
    if (res.success) {
        showToast('Feedback submitted!');
        showFormMessage('userFeedbackMessage', res.message, 'success');
        document.getElementById('userFeedbackForm').reset();
        document.querySelectorAll('#userStarRating i').forEach(s => s.classList.remove('active'));
    } else {
        showFormMessage('userFeedbackMessage', res.message, 'error');
    }
}

// ---- Vendor Dashboard ----
async function loadVendorDashboard() {
    if (!currentUser || currentUser.role !== 'vendor') { navigate('vendor-login'); return; }
    document.getElementById('vendorDashEmail').textContent = currentUser.email;
    loadVendorProfile();
}

async function loadVendorProfile() {
    if (!currentUser) return;
    const res = await api.getVendorProfile(currentUser.email);
    if (res.success) {
        const v = res.data.vendor;
        const b = res.data.business;
        document.getElementById('vendorDashName').textContent = v.name || 'Vendor';

        let html = `
            ${v.profilePic ? `<div class="profile-pic-large"><img src="/${v.profilePic.replace(/\\\\/g, '/')}" alt="Profile"></div>` : ''}
            <div class="profile-row"><span class="pr-label">Name</span><span class="pr-value">${escapeHtml(v.name)}</span></div>
            <div class="profile-row"><span class="pr-label">Email</span><span class="pr-value" style="color:var(--accent)">${escapeHtml(v.email)}</span></div>
            <div class="profile-row"><span class="pr-label">Phone</span><span class="pr-value">${escapeHtml(v.phone || '-')}</span></div>
            <div class="profile-row"><span class="pr-label">City</span><span class="pr-value">${escapeHtml(v.city || '-')}</span></div>
            <div class="profile-row"><span class="pr-label">Address</span><span class="pr-value">${escapeHtml(v.address || '-')}</span></div>
        `;
        if (b) {
            html += `
                <h3 style="margin-top:24px;margin-bottom:12px"><i class="fas fa-briefcase" style="color:var(--accent)"></i> Business Details</h3>
                <div class="profile-row"><span class="pr-label">Business Name</span><span class="pr-value">${escapeHtml(b.businessName || '-')}</span></div>
                <div class="profile-row"><span class="pr-label">Category</span><span class="pr-value">${escapeHtml(b.businessCategory || '-')}</span></div>
                <div class="profile-row"><span class="pr-label">Location</span><span class="pr-value">${b.locationLat || '-'}, ${b.locationLong || '-'}</span></div>
            `;
        }
        document.getElementById('vendorProfileDetails').innerHTML = html;
    }
}

async function loadVendorEditForm() {
    if (!currentUser) return;
    const res = await api.getVendorProfile(currentUser.email);
    if (res.success) {
        const v = res.data.vendor;
        document.getElementById('editVendorName').value = v.name || '';
        document.getElementById('editVendorPhone').value = v.phone || '';
        document.getElementById('editVendorCity').value = v.city || '';
        document.getElementById('editVendorAddress').value = v.address || '';
    }
}

async function updateVendorProfile(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('editVendorName').value,
        phone: document.getElementById('editVendorPhone').value,
        city: document.getElementById('editVendorCity').value,
        address: document.getElementById('editVendorAddress').value,
    };
    const res = await api.updateVendorProfile(currentUser.email, data);
    if (res.success) {
        showToast('Profile updated!');
        showFormMessage('vendorEditMessage', 'Profile updated successfully', 'success');
    } else {
        showFormMessage('vendorEditMessage', res.message, 'error');
    }
}

async function loadVendorBusiness() {
    if (!currentUser) return;
    const res = await api.getVendorProfile(currentUser.email);
    const container = document.getElementById('vendorBusinessContent');
    if (res.success && res.data.business) {
        const b = res.data.business;
        container.innerHTML = `
            <div class="business-display">
                <div class="business-card" style="border:none;padding:0">
                    <div class="bc-header">
                        <div class="bc-icon"><i class="${b.businessIcon || 'fas fa-store'}"></i></div>
                        <div>
                            <div class="bc-name">${escapeHtml(b.businessName || '')}</div>
                            <span class="bc-category">${escapeHtml(b.businessCategory || '')}</span>
                        </div>
                    </div>
                    <div class="bc-details">
                        ${b.description ? `<div class="bc-row"><i class="fas fa-info-circle"></i><span>${escapeHtml(b.description)}</span></div>` : ''}
                        <div class="bc-row"><i class="fas fa-phone"></i><span>${escapeHtml(b.phone || '-')}</span></div>
                        <div class="bc-row"><i class="fas fa-map-marker-alt"></i><span>${escapeHtml(b.address || '-')}</span></div>
                        ${b.gstNo ? `<div class="bc-row"><i class="fas fa-id-card"></i><span>GST: ${escapeHtml(b.gstNo)}</span></div>` : ''}
                        <div class="bc-row"><i class="fas fa-crosshairs"></i><span>Location: ${b.locationLat || '-'}, ${b.locationLong || '-'}</span></div>
                    </div>
                </div>
            </div>
            <h3 style="margin-top:24px;margin-bottom:12px">Edit Business</h3>
            <div class="form-card" style="max-width:100%">
                <form onsubmit="handleEditBusiness(event)">
                    <div class="form-row">
                        <div class="form-group"><label>Business Name</label><input type="text" id="editBizName" value="${escapeHtml(b.businessName || '')}" required></div>
                        <div class="form-group"><label>Phone</label><input type="text" id="editBizPhone" value="${escapeHtml(b.phone || '')}" required></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>GST No</label><input type="text" id="editBizGst" value="${escapeHtml(b.gstNo || '')}"></div>
                        <div class="form-group"><label>Address</label><input type="text" id="editBizAddress" value="${escapeHtml(b.address || '')}" required></div>
                    </div>
                    <button type="submit" class="btn btn-primary" style="background:linear-gradient(135deg,#f093fb,#f5576c)">Update Business</button>
                </form>
                <div id="bizEditMessage" class="form-message"></div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <p style="color:var(--text-secondary);margin-bottom:20px">No business registered yet. Add one below:</p>
            <div class="form-card" style="max-width:100%">
                <form onsubmit="handleAddBusiness(event)">
                    <div class="form-row">
                        <div class="form-group"><label>Business Name</label><input type="text" id="addBizName" required></div>
                        <div class="form-group"><label>Category</label>
                            <select id="addBizCategory" required>
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
                    <div class="form-group"><label>Description</label><textarea id="addBizDesc" rows="2"></textarea></div>
                    <div class="form-row">
                        <div class="form-group"><label>Phone</label><input type="text" id="addBizPhone" required></div>
                        <div class="form-group"><label>GST No</label><input type="text" id="addBizGst"></div>
                    </div>
                    <div class="form-group"><label>Address</label><input type="text" id="addBizAddress" required></div>
                    <div class="form-group"><label>Business Photo</label><input type="file" id="addBizPhoto" accept="image/*"></div>
                    <button type="submit" class="btn btn-primary" style="background:linear-gradient(135deg,#f093fb,#f5576c)">Add Business</button>
                </form>
                <div id="bizAddMessage" class="form-message"></div>
            </div>
        `;
    }
}

async function handleAddBusiness(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', document.getElementById('addBizName').value);
    fd.append('category', document.getElementById('addBizCategory').value);
    fd.append('description', document.getElementById('addBizDesc').value);
    fd.append('phone', document.getElementById('addBizPhone').value);
    fd.append('gst', document.getElementById('addBizGst').value);
    fd.append('address', document.getElementById('addBizAddress').value);
    const fileInput = document.getElementById('addBizPhoto');
    if (fileInput.files[0]) fd.append('businessPhoto', fileInput.files[0]);

    const res = await api.addBusiness(currentUser.email, fd);
    if (res.success) {
        showToast('Business added!');
        loadVendorBusiness();
    } else {
        showFormMessage('bizAddMessage', res.message, 'error');
    }
}

async function handleEditBusiness(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('editBizName').value,
        phone: document.getElementById('editBizPhone').value,
        gst: document.getElementById('editBizGst').value,
        address: document.getElementById('editBizAddress').value,
    };
    const res = await api.editBusiness(currentUser.email, data);
    if (res.success) {
        showToast('Business updated!');
        showFormMessage('bizEditMessage', 'Business updated successfully', 'success');
    } else {
        showFormMessage('bizEditMessage', res.message, 'error');
    }
}

async function updateVendorLocation(e) {
    e.preventDefault();
    const data = {
        lat: document.getElementById('vendorLat').value,
        lng: document.getElementById('vendorLng').value,
    };
    const res = await api.updateLocation(currentUser.email, data);
    if (res.success) {
        showToast('Location updated!');
        showFormMessage('vendorLocationMessage', 'Location updated successfully', 'success');
    } else {
        showFormMessage('vendorLocationMessage', res.message, 'error');
    }
}

async function submitVendorFeedback(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('fbVendorName').value,
        email: document.getElementById('fbVendorEmail').value,
        rating: document.getElementById('fbVendorRating').value,
        remark: document.getElementById('fbVendorRemark').value,
    };
    if (!data.rating) { showToast('Please select a rating', 'error'); return; }
    const res = await api.submitVendorFeedback(data);
    if (res.success) {
        showToast('Feedback submitted!');
        showFormMessage('vendorFeedbackMessage', res.message, 'success');
        document.getElementById('vendorFeedbackForm').reset();
        document.querySelectorAll('#vendorStarRating i').forEach(s => s.classList.remove('active'));
    } else {
        showFormMessage('vendorFeedbackMessage', res.message, 'error');
    }
}

// ---- Admin Dashboard ----
async function loadAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin') { navigate('admin-login'); return; }
    document.getElementById('adminDashEmail').textContent = currentUser.email;
    loadAdminUsers();
}

async function loadAdminUsers() {
    const res = await api.getUsers();
    if (res.success) {
        document.getElementById('adminUsersTable').innerHTML = buildTable(
            ['Name', 'Email', 'Phone', 'City', 'Registered'],
            (res.data || []).map(u => [u.name, { val: u.email, cls: 'td-email' }, u.phone, u.city, u.date])
        );
    }
}

async function loadAdminVendors() {
    const res = await api.getVendors();
    if (res.success) {
        document.getElementById('adminVendorsTable').innerHTML = buildTable(
            ['Name', 'Email', 'Phone', 'City', 'Address'],
            (res.data || []).map(v => [v.name, { val: v.email, cls: 'td-email' }, v.phone, v.city, v.address])
        );
    }
}

async function loadAdminContacts() {
    const res = await api.getContacts();
    if (res.success) {
        document.getElementById('adminContactsTable').innerHTML = buildTable(
            ['Name', 'Email', 'Phone', 'Query', 'Date'],
            (res.data || []).map(c => [c.name, { val: c.email, cls: 'td-email' }, c.phone, c.qurey, c.date])
        );
    }
}

async function loadAdminFeedback() {
    const res = await api.getFeedback();
    if (res.success) {
        document.getElementById('adminFeedbackTable').innerHTML = buildTable(
            ['Name', 'Email', 'Rating', 'Remark', 'Date'],
            (res.data || []).map(f => [f.name, { val: f.emaill, cls: 'td-email' }, renderStars(f.rating), f.remark, f.date])
        );
    }
}

async function loadAdminVendorFeedback() {
    const res = await api.getVendorFeedback();
    if (res.success) {
        document.getElementById('adminVendorFeedbackTable').innerHTML = buildTable(
            ['Name', 'Email', 'Rating', 'Remark', 'Date'],
            (res.data || []).map(f => [f.name, { val: f.emaill, cls: 'td-email' }, renderStars(f.rating), f.remark, f.date])
        );
    }
}

async function loadAdminStats() {
    const [ratingsRes, monthlyRes] = await Promise.all([
        api.getRatingStats(),
        api.getMonthlyContacts()
    ]);

    let html = '';
    if (ratingsRes.success) {
        const r = ratingsRes.data;
        html += '<h3 style="margin-bottom:16px;grid-column:1/-1">Rating Distribution</h3>';
        html += `
            <div class="stat-card"><div class="stat-value">${r.five_star || 0}</div><div class="stat-label">⭐⭐⭐⭐⭐ Five Star</div></div>
            <div class="stat-card"><div class="stat-value">${r.four_star || 0}</div><div class="stat-label">⭐⭐⭐⭐ Four Star</div></div>
            <div class="stat-card"><div class="stat-value">${r.three_star || 0}</div><div class="stat-label">⭐⭐⭐ Three Star</div></div>
            <div class="stat-card"><div class="stat-value">${r.two_star || 0}</div><div class="stat-label">⭐⭐ Two Star</div></div>
            <div class="stat-card"><div class="stat-value">${r.one_star || 0}</div><div class="stat-label">⭐ One Star</div></div>
        `;
    }

    if (monthlyRes.success) {
        html += '<h3 style="margin-top:24px;margin-bottom:16px;grid-column:1/-1">Monthly Contact Queries</h3>';
        const entries = Object.entries(monthlyRes.data || {});
        entries.forEach(([month, count]) => {
            html += `<div class="stat-card"><div class="stat-value">${count}</div><div class="stat-label">${month}</div></div>`;
        });
    }

    document.getElementById('adminStatsContent').innerHTML = html;
}

// ---- Table Builder ----
function buildTable(headers, rows) {
    if (rows.length === 0) return '<p style="text-align:center;color:var(--text-secondary);padding:20px">No data found.</p>';
    let html = '<table class="data-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            if (typeof cell === 'object' && cell !== null && cell.val !== undefined) {
                html += `<td class="${cell.cls || ''}">${cell.val || '-'}</td>`;
            } else {
                html += `<td>${cell || '-'}</td>`;
            }
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
}

// ---- Utilities ----
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
