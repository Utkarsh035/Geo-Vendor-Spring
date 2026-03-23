<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@page import="com.geovendor.entity.*,java.util.*" %>
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>Feedbacks List(user)</title>
            <%@include file="/WEB-INF/views/common/all_css.html" %>
                <style>
                    body {
                        background-color: #f8fafc;
                        font-family: 'Inter', sans-serif;
                    }

                    .page-hero {
                        background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
                        position: relative;
                        padding: 120px 0 60px;
                        text-align: center;
                        overflow: hidden;
                    }

                    .page-hero::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: url("/images/bg_map.png") no-repeat center center/cover;
                        opacity: 0.1;
                        pointer-events: none;
                    }

                    .hero-content {
                        position: relative;
                        z-index: 2;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                        font-weight: 800;
                        color: #0f172a;
                        letter-spacing: -1px;
                    }

                    .hero-title span {
                        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .feedback-container {
                        max-width: 1200px;
                        margin: -40px auto 80px;
                        padding: 0 20px;
                        position: relative;
                        z-index: 3;
                    }

                    .feedback-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                        gap: 25px;
                    }

                    .feedback-card {
                        background: white;
                        border-radius: 20px;
                        padding: 30px;
                        box-shadow: 0 4px 15px -3px rgba(148, 163, 184, 0.1);
                        border: 1px solid #f1f5f9;
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                    }

                    .feedback-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 15px 30px -10px rgba(148, 163, 184, 0.2);
                    }

                    .author-info {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 20px;
                    }

                    .author-avatar {
                        width: 48px;
                        height: 48px;
                        background: var(--bg-grey-gradient);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--primary);
                        font-weight: 700;
                        font-size: 1.2rem;
                    }

                    .author-name {
                        font-weight: 700;
                        color: #1e293b;
                        font-size: 1.05rem;
                    }

                    .rating-stars {
                        color: #f59e0b;
                        /* Amber for stars */
                        margin-bottom: 12px;
                        font-size: 0.9rem;
                    }

                    .feedback-text {
                        color: #475569;
                        font-size: 0.95rem;
                        line-height: 1.6;
                        flex-grow: 1;
                        font-style: italic;
                    }

                    .pin-img {
                        position: absolute;
                        bottom: 20px;
                        right: 20px;
                        opacity: 0.5;
                    }
                </style>
        </head>

        <body>
            <%@include file="/WEB-INF/views/admin/admin_header.html" %>

                <!-- Hero Section -->
                <section class="page-hero">
                    <div class="hero-content">
                        <h1 class="hero-title">User <span>Feedback</span></h1>
                    </div>
                    <img alt="pin-img" src="/images/pin.gif" height="40" width="50" class="pin-img">
                </section>

                <div class="feedback-container">
                    <% List<Feedback> feedbacklist = (List<Feedback>) request.getAttribute("feedbackList");
                            if(feedbacklist.size()>0){
                            %>
                            <div class="feedback-grid">
                                <%for(Feedback fb:feedbacklist) { String rt=fb.getRating(); String[]rate=rt.split(",");
                                    %>
                                    <div class="feedback-card">
                                        <div class="author-info">
                                            <div class="author-avatar">
                                                <%=fb.getName().substring(0, 1).toUpperCase() %>
                                            </div>
                                            <div class="author-name">
                                                <%=fb.getName() %>
                                            </div>
                                        </div>

                                        <div class="rating-stars">
                                            <%for(String r :rate) { %>
                                                <i class="fas fa-star"></i>
                                                <%} %>
                                        </div>

                                        <div class="feedback-text">
                                            "<%=fb.getRemark() %>"
                                        </div>
                                    </div>
                                    <%} %>
                            </div>
                            <%} else{ %>
                                <div class="text-center p-5 bg-white rounded-4 shadow-sm border border-light-subtle">
                                    <i class="fas fa-comment-slash mb-3" style="font-size: 3rem; color: #cbd5e1;"></i>
                                    <h3 style="color: #64748b;">No Feedback Received Yet</h3>
                                </div>
                                <%} %>
                </div>




                <%@ include file="/WEB-INF/views/common/footer.html" %>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                        crossorigin="anonymous"></script>
        </body>

        </html>