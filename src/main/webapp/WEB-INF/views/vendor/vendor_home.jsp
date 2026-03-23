<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ page import="com.geovendor.entity.*,java.util.*" %>
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vendor Home | GeoVendor</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                rel="stylesheet">
            <%@ include file="/WEB-INF/views/common/all_css.html" %>
                <style>
                    body {
                        margin: 0;
                        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                        background-color: #f8fafc;
                    }

                    .profile-hero {
                        background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
                        position: relative;
                        padding: 140px 0 80px;
                        text-align: center;
                        overflow: hidden;
                    }

                    .profile-hero::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: url("/images/bg_map.png") no-repeat center center/cover;
                        opacity: 0.15;
                        filter: grayscale(15%);
                        pointer-events: none;
                    }

                    .profile-hero-content {
                        position: relative;
                        z-index: 2;
                    }

                    .profile-avatar-wrapper {
                        width: 140px;
                        height: 140px;
                        margin: 0 auto 24px;
                        position: relative;
                    }

                    .profile-avatar {
                        width: 140px;
                        height: 140px;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 4px solid white;
                        box-shadow: 0 12px 30px rgba(148, 163, 184, 0.3);
                        opacity: 0;
                        transform: scale(0.6);
                        animation: avatarIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s;
                    }

                    .avatar-ring {
                        position: absolute;
                        top: -6px;
                        left: -6px;
                        width: 152px;
                        height: 152px;
                        border-radius: 50%;
                        border: 2px solid rgba(37, 99, 235, 0.3);
                        opacity: 0;
                        animation: ringIn 0.6s ease forwards 0.7s;
                    }

                    .profile-greeting {
                        font-size: 2rem;
                        font-weight: 800;
                        color: #0f172a;
                        letter-spacing: -1px;
                        margin-bottom: 8px;
                        opacity: 0;
                        transform: translateY(15px);
                        animation: fadeUp 0.6s ease forwards 0.4s;
                    }

                    .profile-greeting span {
                        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .profile-tagline {
                        font-size: 1.05rem;
                        color: #64748b;
                        font-weight: 400;
                        opacity: 0;
                        transform: translateY(10px);
                        animation: fadeUp 0.6s ease forwards 0.55s;
                    }

                    .info-section {
                        max-width: 900px;
                        margin: -50px auto 60px;
                        padding: 0 20px;
                        position: relative;
                        z-index: 3;
                    }

                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                        gap: 20px;
                    }

                    .info-card {
                        background: white;
                        border: 1px solid #f1f5f9;
                        border-radius: 20px;
                        padding: 28px 24px;
                        box-shadow: 0 4px 15px -3px rgba(148, 163, 184, 0.12);
                        transition: all 0.3s ease;
                        opacity: 0;
                        transform: translateY(20px);
                    }

                    .info-card:nth-child(1) {
                        animation: fadeUp 0.5s ease forwards 0.6s;
                    }

                    .info-card:nth-child(2) {
                        animation: fadeUp 0.5s ease forwards 0.7s;
                    }

                    .info-card:nth-child(3) {
                        animation: fadeUp 0.5s ease forwards 0.8s;
                    }

                    .info-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 25px -5px rgba(148, 163, 184, 0.2);
                        border-color: #e2e8f0;
                    }

                    .info-card-icon {
                        width: 50px;
                        height: 50px;
                        border-radius: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        margin-bottom: 16px;
                        transition: all 0.3s ease;
                    }

                    .info-card:hover .info-card-icon {
                        transform: scale(1.1) rotate(5deg);
                    }

                    .icon-blue {
                        background: rgba(37, 99, 235, 0.1);
                        color: #2563eb;
                    }

                    .icon-green {
                        background: rgba(34, 197, 94, 0.1);
                        color: #16a34a;
                    }

                    .icon-amber {
                        background: rgba(245, 158, 11, 0.1);
                        color: #d97706;
                    }

                    .info-card-label {
                        font-size: 0.75rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        color: #94a3b8;
                        letter-spacing: 0.8px;
                        margin-bottom: 4px;
                    }

                    .info-card-value {
                        font-size: 1.1rem;
                        font-weight: 600;
                        color: #0f172a;
                        word-break: break-word;
                    }

                    .actions-section {
                        max-width: 900px;
                        margin: 0 auto 60px;
                        padding: 0 20px;
                    }

                    .actions-title {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #0f172a;
                        margin-bottom: 20px;
                        letter-spacing: -0.3px;
                    }

                    .actions-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 16px;
                    }

                    .action-btn {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 18px 22px;
                        background: white;
                        border: 1px solid #f1f5f9;
                        border-radius: 16px;
                        text-decoration: none;
                        color: #334155;
                        font-weight: 600;
                        font-size: 0.95rem;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 8px rgba(148, 163, 184, 0.08);
                    }

                    .action-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 20px rgba(148, 163, 184, 0.15);
                        border-color: #2563eb;
                        color: #2563eb;
                    }

                    .action-btn i {
                        font-size: 1.1rem;
                        width: 20px;
                        text-align: center;
                    }

                    @keyframes avatarIn {
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    @keyframes ringIn {
                        to {
                            opacity: 1;
                        }
                    }

                    @keyframes fadeUp {
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @media (max-width: 768px) {
                        .profile-hero {
                            padding: 120px 0 60px;
                        }

                        .profile-avatar-wrapper {
                            width: 110px;
                            height: 110px;
                        }

                        .profile-avatar {
                            width: 110px;
                            height: 110px;
                        }

                        .avatar-ring {
                            width: 122px;
                            height: 122px;
                        }

                        .profile-greeting {
                            font-size: 1.5rem;
                        }

                        .info-section {
                            margin-top: -35px;
                        }
                    }

                    @media (max-width: 576px) {
                        .profile-greeting {
                            font-size: 1.3rem;
                        }

                        .info-grid {
                            grid-template-columns: 1fr;
                        }

                        .actions-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
        </head>

        <body>
            <% String email=(String) session.getAttribute("sessionEmail"); if (email==null || session.isNew()) {
                request.setAttribute("message", "Please Login to Continue" ); RequestDispatcher
                rd=request.getRequestDispatcher("/vendor/vendor_login.jsp"); rd.forward(request, response); } else {
                Vendor v=(Vendor) request.getAttribute("vendor"); String uploadPath=request.getContextPath(); String
                imagePath=uploadPath + "/" + v.getProfile_pic(); %>

                <%@ include file="/WEB-INF/views/vendor/vendor_header.html" %>

                    <section class="profile-hero">
                        <div class="profile-hero-content">
                            <div class="profile-avatar-wrapper">
                                <img src="<%= imagePath %>" class="profile-avatar" alt="Profile">
                                <div class="avatar-ring"></div>
                            </div>
                            <h1 class="profile-greeting">Hello, <span>
                                    <%= v.getName() %>
                                </span></h1>
                            <p class="profile-tagline">Welcome back to your vendor dashboard</p>
                        </div>
                    </section>

                    <div class="info-section">
                        <div class="info-grid">
                            <div class="info-card">
                                <div class="info-card-icon icon-blue"><i class="fas fa-map-marker-alt"></i></div>
                                <div class="info-card-label">City</div>
                                <div class="info-card-value">
                                    <%= v.getCity() %>
                                </div>
                            </div>
                            <div class="info-card">
                                <div class="info-card-icon icon-green"><i class="fas fa-envelope"></i></div>
                                <div class="info-card-label">Email</div>
                                <div class="info-card-value">
                                    <%= v.getEmail() %>
                                </div>
                            </div>
                            <div class="info-card">
                                <div class="info-card-icon icon-amber"><i class="fas fa-phone-alt"></i></div>
                                <div class="info-card-label">Phone No</div>
                                <div class="info-card-value">
                                    <%= v.getPhone() %>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="actions-section">
                        <h3 class="actions-title">Quick Actions</h3>
                        <div class="actions-grid">
                            <a href="/vendor/business/add" class="action-btn"><i class="fas fa-plus"></i> Add
                                Business</a>
                            <a href="/vendor/business-view" class="action-btn"><i class="fas fa-eye"></i>
                                View Business</a>
                            <a href="/vendor/edit" class="action-btn"><i class="fas fa-user-edit"></i> Edit Profile</a>
                            <a href="/vendor/location/update" class="action-btn"><i class="fas fa-map-marker-alt"></i>
                                Update Location</a>
                        </div>
                    </div>

                    <%@ include file="/WEB-INF/views/common/footer.html" %>
                        <% } %>
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                                crossorigin="anonymous"></script>
        </body>

        </html>