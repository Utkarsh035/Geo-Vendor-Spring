<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ page import="com.geovendor.entity.*,java.util.*" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GeoVendor | Premium Local Network</title>

            <!-- jQuery -->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
                integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
                crossorigin="anonymous" referrerpolicy="no-referrer"></script>

            <!-- Google Fonts: Inter -->
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                rel="stylesheet">

            <!-- Custom CSS & Bootstrap -->
            <%@ include file="/WEB-INF/views/common/all_css.html" %>

                <style>
                    /* Page-Specific Styles - Platinum Edition */

                    /* FORCE LIGHT THEME OVERRIDES (In case style.css is cached/stale) */
                    body,
                    .main-body {
                        background-color: #f8fafc !important;
                        color: #1e293b !important;
                    }

                    .bg-white {
                        background-color: #ffffff !important;
                    }

                    .bg-light-grey {
                        background-color: #f8fafc !important;
                    }

                    /* Container overrides to ensure no dark bleed */
                    .container {
                        position: relative;
                        z-index: 2;
                    }

                    /* Hero Section */
                    .hero-section {
                        position: relative;
                        height: 92vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
                        /* Sophisticated Grey Radial */
                        margin-top: 60px;
                        background-color: #f1f5f9;
                        /* Fallback */
                    }

                    /* Background Map - Monochrome & Sharp */
                    .hero-bg {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 120%;
                        height: 120%;
                        transform: translate(-50%, -50%);
                        background: url("/images/bg_map.png") no-repeat center center/cover;
                        opacity: 0.25;
                        /* Increased visibility */
                        z-index: 1;
                        filter: grayscale(15%);
                        /* Slight color, mostly natural */
                        min-width: 100%;
                        min-height: 100%;
                    }

                    .hero-content {
                        position: relative;
                        z-index: 10;
                        text-align: center;
                        max-width: 850px;
                        padding: 0 30px;
                    }

                    .hero-title {
                        font-size: clamp(3rem, 6vw, 4.8rem);
                        font-weight: 800;
                        margin-bottom: 1.5rem;
                        color: #0f172a;
                        line-height: 1.05;
                        letter-spacing: -1.5px;
                        text-shadow: 0 20px 40px rgba(148, 163, 184, 0.2);
                    }

                    .hero-subtitle {
                        font-size: clamp(1.2rem, 2.5vw, 1.5rem);
                        color: #475569;
                        margin-bottom: 3.5rem;
                        font-weight: 400;
                        line-height: 1.6;
                        letter-spacing: -0.2px;
                    }

                    /* Feature Cards - Platinum & Minimal */
                    .feature-card {
                        padding: 3.5rem 2.5rem;
                        text-align: center;
                        height: 100%;
                        background: white;
                        border-radius: 20px;
                        box-shadow: var(--shadow-soft);
                        border: 1px solid #f1f5f9;
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        position: relative;
                        overflow: hidden;
                    }

                    /* Hover Accent Bar */
                    .feature-card::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 4px;
                        background: var(--primary);
                        transform: scaleX(0);
                        transform-origin: left;
                        transition: transform 0.4s ease;
                    }

                    .feature-card:hover {
                        transform: translateY(-12px);
                        box-shadow: var(--shadow-med);
                        border-color: white;
                    }

                    .feature-card:hover::after {
                        transform: scaleX(1);
                    }

                    .feature-icon-wrapper {
                        width: 80px;
                        height: 80px;
                        background: #f8fafc;
                        color: #1e293b;
                        /* Dark Grey Icon */
                        border-radius: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2rem;
                        margin: 0 auto 2rem;
                        transition: all 0.3s ease;
                        border: 1px solid #e2e8f0;
                        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
                    }

                    /* Color accents on hover - The "Small Elements" user requested */
                    .feature-card:hover .feature-icon-wrapper {
                        background: var(--primary);
                        color: white;
                        transform: scale(1.1) rotate(5deg);
                        border-color: var(--primary);
                        box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
                    }

                    .feature-card h3 {
                        font-size: 1.4rem;
                        font-weight: 700;
                        margin-bottom: 1rem;
                        color: #0f172a;
                        letter-spacing: -0.5px;
                    }

                    .feature-text {
                        font-size: 1rem;
                        color: #64748b;
                        line-height: 1.7;
                    }

                    /* Feedback Cards - Structured & Metallic */
                    .feedback-card {
                        background: white;
                        padding: 3rem 2.5rem;
                        border-radius: 20px;
                        box-shadow: var(--shadow-soft);
                        border: 1px solid #f1f5f9;
                        transition: all 0.3s ease;
                        height: 100%;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                    }

                    .feedback-card::before {
                        content: '\f10d';
                        /* FontAwesome Quote */
                        font-family: 'Font Awesome 5 Free';
                        font-weight: 900;
                        position: absolute;
                        top: 2rem;
                        right: 2rem;
                        font-size: 4rem;
                        color: #f8fafc;
                        /* Extremely subtle watermark */
                        z-index: 0;
                    }

                    .feedback-card:hover {
                        transform: translateY(-6px);
                        box-shadow: var(--shadow-med);
                        border-color: #cbd5e1;
                        /* Darker grey border on hover */
                    }

                    .feedback-content {
                        position: relative;
                        z-index: 1;
                        flex-grow: 1;
                    }

                    .feedback-quote {
                        color: #334155;
                        font-style: italic;
                        font-size: 1.05rem;
                        line-height: 1.8;
                        margin-bottom: 2rem;
                    }

                    .feedback-footer {
                        position: relative;
                        z-index: 1;
                        display: flex;
                        align-items: center;
                        border-top: 1px solid #f1f5f9;
                        padding-top: 1.5rem;
                        margin-top: auto;
                    }

                    .feedback-avatar {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin-right: 1rem;
                        border: 2px solid white;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }

                    .feedback-info h5 {
                        font-size: 0.95rem;
                        font-weight: 700;
                        margin: 0;
                        color: #0f172a;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .star-rating {
                        color: #f59e0b;
                        /* Vibrant Gold Accent */
                        font-size: 0.75rem;
                        margin-top: 4px;
                    }

                    /* CTA Section - Dark Slate Contrast */
                    .cta-section {
                        background: #0f172a;
                        /* Darkest Slate */
                        padding: 7rem 0;
                        text-align: center;
                        position: relative;
                    }

                    .cta-section h2 {
                        color: white;
                        font-size: 3rem;
                        margin-bottom: 1rem;
                    }

                    .cta-btn-group {
                        margin-top: 2.5rem;
                    }
                </style>
        </head>

        <body>
            <div class="main-body">

                <%@ include file="/WEB-INF/views/common/nav_bar.html" %>

                    <!-- Hero Section -->
                    <section class="hero-section">
                        <div class="hero-bg"></div>

                        <div class="hero-content">
                            <h1 class="hero-title">Local Gems. <br> <span class="text-gradient">Premium
                                    Standards.</span></h1>
                            <p class="hero-subtitle">The definitive platform for discovering quality vendors in your
                                area. Refined, reliable, and ready for you.</p>
                            <div class="d-flex gap-3 justify-content-center flex-wrap">
                                <a href="/user/login" class="btn-primary-platinum btn-lg">Explore
                                    Now</a>
                                <a href="/vendor/registration" class="btn-outline-platinum btn-lg">Partner With Us</a>
                            </div>
                        </div>
                    </section>

                    <!-- Features Section -->
                    <section class="container bg-white"> <!-- Explicit White -->
                        <div class="row g-4 mb-5">
                            <div class="col-md-4">
                                <div class="feature-card">
                                    <div class="feature-icon-wrapper"><i class="fas fa-map-marked-alt"></i></div>
                                    <h3>Precision Mapping</h3>
                                    <p class="feature-text">Navigate with confidence using our ultra-responsive,
                                        detailed local mapping system.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="feature-card">
                                    <div class="feature-icon-wrapper"><i class="fas fa-check-circle"></i></div>
                                    <h3>Verified Excellence</h3>
                                    <p class="feature-text">We rigorously vet every vendor to ensure you receive only
                                        the highest standard of service.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="feature-card">
                                    <div class="feature-icon-wrapper"><i class="fas fa-bolt"></i></div>
                                    <h3>Seamless Connection</h3>
                                    <p class="feature-text">Connect instantly with vendors through our optimized
                                        real-time communication platform.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- User Feedbacks -->
                    <section class="container bg-light-grey"> <!-- Explicit Light Grey -->
                        <div class="section-title">Client Experiences</div>
                        <p class="section-subtitle">Real feedback from our valued community.</p>

                        <div class="row g-4 justify-content-center">
                            <% List<User> userList = (List<User>) request.getAttribute("userFeedbacks");
                                    for(User u : userList){
                                    String picName = u.getProfile_pic();
                                    String picPath = request.getContextPath() + "/" + picName;
                                    Feedback f = u.getFd();
                                    String[] rate = f.getRating().split(",");
                                    %>
                                    <div class="col-lg-4 col-md-6">
                                        <div class="feedback-card">
                                            <div class="feedback-content">
                                                <p class="feedback-quote">"<%= f.getRemark() %>"</p>
                                            </div>
                                            <div class="feedback-footer">
                                                <img src="<%=picPath%>" alt="Profile" class="feedback-avatar">
                                                <div class="feedback-info">
                                                    <h5>
                                                        <%= f.getName() %>
                                                    </h5>
                                                    <div class="star-rating">
                                                        <% for(String r : rate) { %>
                                                            <i class="fas fa-star"></i>
                                                            <% } %>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <% } %>
                        </div>
                    </section>

                    <!-- Vendor Feedbacks -->
                    <section class="container bg-white"> <!-- Explicit White (removed inline style) -->
                        <div class="section-title">Vendor Success</div>
                        <p class="section-subtitle">Partners growing their business with GeoVendor.</p>

                        <div class="row g-4 justify-content-center">
                            <% List<Vendor> vendorList = (List<Vendor>) request.getAttribute("vendorFeedbacks");
                                    for(Vendor v : vendorList){
                                    String picName = v.getProfile_pic();
                                    String picPath = request.getContextPath() + "/" + picName;
                                    VendorFeedback vf = v.getVf();
                                    String[] rate = vf.getRating().split(",");
                                    %>
                                    <div class="col-lg-4 col-md-6">
                                        <div class="feedback-card">
                                            <div class="feedback-content">
                                                <p class="feedback-quote">"<%= vf.getRemark() %>"</p>
                                            </div>
                                            <div class="feedback-footer">
                                                <img src="<%=picPath%>" alt="Profile" class="feedback-avatar">
                                                <div class="feedback-info">
                                                    <h5>
                                                        <%= vf.getName() %>
                                                    </h5>
                                                    <div class="star-rating">
                                                        <% for(String r : rate) { %>
                                                            <i class="fas fa-star"></i>
                                                            <% } %>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <% } %>
                        </div>
                    </section>

                    <!-- CTA Banner -->
                    <section class="cta-section">
                        <div class="container">
                            <h2>Elevate Your Experience</h2>
                            <p class="text-secondary fs-5">Join the network that defines quality local commerce.</p>
                            <div class="cta-btn-group">
                                <a href="/user/registration" class="btn-primary-platinum btn-lg">Get
                                    Started</a>
                            </div>
                        </div>
                    </section>

                    <%@ include file="/WEB-INF/views/common/footer.html" %>

            </div>

            <!-- Bootstrap JS -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                crossorigin="anonymous"></script>

        </body>

        </html>