<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ page import="com.geovendor.entity.*,java.util.*" %>
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My Business | GeoVendor</title>

            <!-- Google Fonts: Inter -->
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                rel="stylesheet">

            <%@include file="/WEB-INF/views/common/all_css.html" %>

                <style>
                    body {
                        margin: 0;
                        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                        background-color: #f8fafc;
                    }

                    /* ===== Hero Banner ===== */
                    .biz-hero {
                        background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
                        position: relative;
                        padding: 140px 0 80px;
                        text-align: center;
                        overflow: hidden;
                    }

                    .biz-hero::before {
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

                    .biz-hero-content {
                        position: relative;
                        z-index: 2;
                    }

                    /* ===== Image / Logo ===== */
                    .biz-img-wrapper {
                        width: 160px;
                        height: 160px;
                        margin: 0 auto 24px;
                        position: relative;
                    }

                    .biz-img {
                        width: 160px;
                        height: 160px;
                        border-radius: 24px;
                        object-fit: cover;
                        border: 4px solid white;
                        box-shadow: 0 12px 30px rgba(148, 163, 184, 0.3);
                        opacity: 0;
                        transform: scale(0.6);
                        animation: imgIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s;
                    }

                    .img-ring {
                        position: absolute;
                        top: -6px;
                        left: -6px;
                        width: 172px;
                        height: 172px;
                        border-radius: 28px;
                        border: 2px solid rgba(37, 99, 235, 0.3);
                        opacity: 0;
                        animation: ringIn 0.6s ease forwards 0.7s;
                    }

                    /* ===== Title & Category ===== */
                    .biz-name {
                        font-size: 2.25rem;
                        font-weight: 800;
                        color: #0f172a;
                        letter-spacing: -1px;
                        margin-bottom: 8px;
                        opacity: 0;
                        transform: translateY(15px);
                        animation: fadeUp 0.6s ease forwards 0.4s;
                    }

                    .biz-name span {
                        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .biz-category {
                        font-size: 1.05rem;
                        color: #64748b;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        opacity: 0;
                        transform: translateY(10px);
                        animation: fadeUp 0.6s ease forwards 0.55s;
                    }

                    /* ===== Info Cards Section ===== */
                    .info-section {
                        max-width: 1000px;
                        margin: -50px auto 60px;
                        padding: 0 20px;
                        position: relative;
                        z-index: 3;
                    }

                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

                    .info-card:nth-child(4) {
                        animation: fadeUp 0.5s ease forwards 0.9s;
                    }

                    .info-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 25px -5px rgba(148, 163, 184, 0.2);
                        border-color: #2563eb;
                    }

                    .info-card-icon {
                        width: 48px;
                        height: 48px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.1rem;
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

                    .icon-slate {
                        background: rgba(71, 85, 105, 0.1);
                        color: #475569;
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
                        font-size: 1rem;
                        font-weight: 600;
                        color: #0f172a;
                        word-break: break-word;
                        line-height: 1.5;
                    }

                    /* ===== Description Section ===== */
                    .desc-section {
                        max-width: 1000px;
                        margin: 0 auto 60px;
                        padding: 0 20px;
                    }

                    .desc-card {
                        background: white;
                        border: 1px solid #f1f5f9;
                        border-radius: 24px;
                        padding: 35px;
                        box-shadow: 0 4px 15px -3px rgba(148, 163, 184, 0.08);
                    }

                    .desc-title {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #0f172a;
                        margin-bottom: 16px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .desc-title i {
                        color: #2563eb;
                    }

                    .desc-content {
                        font-size: 1rem;
                        color: #475569;
                        line-height: 1.8;
                        margin-bottom: 0;
                    }

                    /* ===== Quick Actions (Vendor Only) ===== */
                    .actions-section {
                        max-width: 1000px;
                        margin: 0 auto 60px;
                        padding: 0 20px;
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

                    /* ===== Animations ===== */
                    @keyframes imgIn {
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

                    /* ===== Responsive ===== */
                    @media (max-width: 768px) {
                        .biz-hero {
                            padding: 120px 0 60px;
                        }

                        .biz-img-wrapper,
                        .biz-img {
                            width: 120px;
                            height: 120px;
                        }

                        .img-ring {
                            width: 132px;
                            height: 132px;
                        }

                        .biz-name {
                            font-size: 1.75rem;
                        }

                        .info-section {
                            margin-top: -35px;
                        }

                        .info-grid {
                            grid-template-columns: 1fr 1fr;
                        }
                    }

                    @media (max-width: 576px) {
                        .biz-name {
                            font-size: 1.5rem;
                        }

                        .info-grid {
                            grid-template-columns: 1fr;
                        }

                        .desc-card {
                            padding: 25px;
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
                rd=request.getRequestDispatcher("/vendor/vendor_login.jsp"); rd.forward(request, response); return; }
                Business bs=(Business) request.getAttribute("business"); Vendor v=(Vendor)
                request.getAttribute("vendor"); String uploadPath=request.getContextPath(); String imagePath=uploadPath
                + "/" + v.getProfile_pic(); %>

                <%@include file="/WEB-INF/views/vendor/vendor_header.html" %>

                    <% if (bs !=null) { String businessImagePath=uploadPath + "/" + bs.getBusiness_photo(); %>
                        <!-- Hero Banner -->
                        <section class="biz-hero">
                            <div class="biz-hero-content">
                                <div class="biz-img-wrapper">
                                    <img src="<%= businessImagePath %>" class="biz-img" alt="Business Image">
                                    <div class="img-ring"></div>
                                </div>
                                <h1 class="biz-name"><span>
                                        <%= bs.getBusiness_name() %>
                                    </span></h1>
                                <p class="biz-category">
                                    <%= (bs.getBusiness_category() !=null &&
                                        !bs.getBusiness_category().trim().isEmpty()) ? bs.getBusiness_category()
                                        : "Local Business" %>
                                </p>
                            </div>
                        </section>

                        <!-- Info Cards -->
                        <div class="info-section">
                            <div class="info-grid">
                                <div class="info-card">
                                    <div class="info-card-icon icon-blue">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div class="info-card-label">Address</div>
                                    <div class="info-card-value">
                                        <%= bs.getAddress() %>
                                    </div>
                                </div>
                                <div class="info-card">
                                    <div class="info-card-icon icon-green">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <div class="info-card-label">Email</div>
                                    <div class="info-card-value">
                                        <%= bs.getEmail() %>
                                    </div>
                                </div>
                                <div class="info-card">
                                    <div class="info-card-icon icon-amber">
                                        <i class="fas fa-phone-alt"></i>
                                    </div>
                                    <div class="info-card-label">Phone No</div>
                                    <div class="info-card-value">
                                        <%= bs.getPhone() %>
                                    </div>
                                </div>
                                <div class="info-card">
                                    <div class="info-card-icon icon-slate">
                                        <i class="fas fa-receipt"></i>
                                    </div>
                                    <div class="info-card-label">GST No</div>
                                    <div class="info-card-value">
                                        <%= bs.getGst_no() %>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Description Section -->
                        <div class="desc-section">
                            <div class="desc-card">
                                <h3 class="desc-title"><i class="fas fa-info-circle"></i> About My Business</h3>
                                <p class="desc-content">
                                    <%= bs.getDescription() !=null && !bs.getDescription().isEmpty() ?
                                        bs.getDescription() : "No description provided for your business." %>
                                </p>
                            </div>
                        </div>

                        <!-- Vendor Actions -->
                        <div class="actions-section">
                            <div class="actions-grid">
                                <a href="/vendor/business/edit" class="action-btn">
                                    <i class="fas fa-edit"></i> Edit Business Details
                                </a>
                                <a href="/vendor/location/update" class="action-btn">
                                    <i class="fas fa-map-marker-alt"></i> Update Map Location
                                </a>
                            </div>
                        </div>

                        <% } else { %>
                            <div style="text-align:center; margin-top:120px; padding: 40px;">
                                <div class="biz-img-wrapper" style="opacity: 0.5;">
                                    <i class="fas fa-store-slash" style="font-size: 80px; color: #94a3b8;"></i>
                                </div>
                                <h3 style="color: #64748b; font-family: 'Inter', sans-serif; font-weight: 600;">
                                    You haven't added your business details yet.
                                </h3>
                                <a href="/vendor/business/add" class="btn btn-primary mt-3"
                                    style="border-radius: 50px; padding: 10px 25px;">Add Business Now</a>
                            </div>
                            <% } %>

                                <%@ include file="/WEB-INF/views/common/footer.html" %>
                                    <script
                                        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                                        crossorigin="anonymous"></script>
        </body>

        </html>