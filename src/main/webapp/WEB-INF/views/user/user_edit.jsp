<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <% response.setHeader("Cache-Control","no-cache,no-store,must-revalidate"); response.setHeader("Pragma","no-cache");
        response.setDateHeader ("Expires", 0); %>
        <%@page import="com.geovendor.entity.*,java.util.*" %>

            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Edit Profile | GeoVendor</title>

                <!-- Google Fonts: Inter -->
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet">

                <%@include file="/WEB-INF/views/common/all_css.html" %>
                    <style>
                        body {
                            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                            background-color: #f8fafc;
                        }

                        /* ===== Background Wrapper ===== */
                        .edit-wrapper {
                            background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
                            min-height: 100vh;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            padding: 40px 15px;
                            position: relative;
                            overflow-x: hidden;
                            margin-top: 60px;
                        }

                        .edit-wrapper::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: url("/images/bg_map.png") no-repeat center center/cover;
                            opacity: 0.2;
                            filter: grayscale(15%);
                            pointer-events: none;
                        }

                        /* ===== Edit Card ===== */
                        .edit-card {
                            background: #ffffff;
                            box-shadow: 0 20px 40px -5px rgba(148, 163, 184, 0.15);
                            border: 1px solid #f1f5f9;
                            border-radius: 24px;
                            padding: 35px;
                            position: relative;
                            z-index: 2;
                            max-width: 500px;
                            width: 100%;
                            animation: fadeUp 0.7s ease-out;
                        }

                        /* ===== Profile Image ===== */
                        .profile-img {
                            border-radius: 50%;
                            width: 120px;
                            height: 120px;
                            margin: auto;
                            border: 3px solid #e2e8f0;
                            box-shadow: 0 8px 20px rgba(148, 163, 184, 0.2);
                            object-fit: cover;
                            display: block;
                            opacity: 0;
                            transform: scale(0.5);
                            animation: zoomIn 0.8s ease-out forwards 0.3s;
                        }

                        /* ===== Form Fields ===== */
                        .edit-card .form-control,
                        .edit-card textarea.form-control {
                            border: 1px solid #e2e8f0;
                            background: #f8fafc;
                            border-radius: 12px;
                            font-family: 'Inter', sans-serif;
                            padding: 10px 14px;
                        }

                        .edit-card .form-control:focus,
                        .edit-card textarea.form-control:focus {
                            background: white;
                            border-color: #2563eb;
                            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                        }

                        .edit-card .card-text {
                            color: #475569;
                            font-size: 0.95rem;
                            font-weight: 500;
                            margin-bottom: 12px;
                        }

                        .edit-card .email-display {
                            color: #64748b;
                            font-size: 0.9rem;
                            margin-bottom: 16px;
                        }

                        /* ===== Labels ===== */
                        .field-label {
                            font-size: 0.8rem;
                            font-weight: 600;
                            text-transform: uppercase;
                            color: #94a3b8;
                            letter-spacing: 0.5px;
                            margin-bottom: 4px;
                        }

                        /* ===== Submit Button ===== */
                        .btn-platinum-submit {
                            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                            color: white;
                            padding: 14px 28px;
                            border-radius: 50px;
                            font-weight: 600;
                            font-family: 'Inter', sans-serif;
                            border: none;
                            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
                            transition: all 0.3s ease;
                            font-size: 15px;
                        }

                        .btn-platinum-submit:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
                            color: white;
                        }

                        /* ===== Pin ===== */
                        .pin-img {
                            position: absolute;
                            bottom: 20px;
                            right: 20px;
                            height: 40px;
                            width: 50px;
                            opacity: 0;
                            transform: translateY(20px);
                            animation: fadeInUp 1s forwards 0.8s;
                        }

                        /* ===== Animations ===== */
                        @keyframes fadeUp {
                            from {
                                opacity: 0;
                                transform: translateY(25px);
                            }

                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        @keyframes zoomIn {
                            to {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }

                        @keyframes fadeInUp {
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        /* ===== Responsive ===== */
                        @media (max-width: 768px) {
                            .edit-card {
                                padding: 24px 18px;
                                margin: 0 10px;
                            }

                            .profile-img {
                                width: 100px;
                                height: 100px;
                            }
                        }
                    </style>
            </head>

            <body>

                <% String email=(String) session.getAttribute("sessionEmail"); if (email==null || session.isNew()) {
                    request.setAttribute("message", "Please Login to Continue" ); RequestDispatcher
                    rd=request.getRequestDispatcher("/user/user_login.jsp"); rd.forward(request, response); } else {
                    User u=(User) request.getAttribute("user"); String uploadPath=request.getContextPath(); String
                    imagePath=uploadPath + "/" + u.getProfile_pic(); %>

                    <%@include file="/WEB-INF/views/user/user_header.html" %>

                        <div class="edit-wrapper">
                            <div class="edit-card">
                                <img src="<%=imagePath%>" class="profile-img mt-2 mb-3">
                                <form action="/user/edit" method="post" enctype="multipart/form-data">
                                    <div class="mb-3">
                                        <div class="field-label">Profile Photo</div>
                                        <input type="file" name="profile_pic" class="form-control" required>
                                    </div>
                                    <p class="email-display">📧 Email: <%=u.getEmail()%>
                                    </p>
                                    <div class="mb-3">
                                        <div class="field-label">Name</div>
                                        <input type="text" name="name" class="form-control" required
                                            value="<%=u.getName()%>">
                                    </div>
                                    <div class="mb-3">
                                        <div class="field-label">City</div>
                                        <input type="text" name="city" class="form-control" required
                                            value="<%=u.getCity()%>">
                                    </div>
                                    <div class="mb-3">
                                        <div class="field-label">Phone No</div>
                                        <input type="tel" name="phone" class="form-control" required
                                            value="<%=u.getPhone()%>">
                                    </div>
                                    <div class="mb-3">
                                        <div class="field-label">Address</div>
                                        <textarea class="form-control" placeholder="address" name="address"
                                            required><%=u.getAddress() %></textarea>
                                    </div>
                                    <div class="w-100 text-center">
                                        <button class="btn-platinum-submit">Update Profile</button>
                                    </div>
                                </form>
                            </div>
                            <img src="/images/pin.gif" alt="pin-img" class="pin-img">
                        </div>

                        <%@ include file="/WEB-INF/views/common/footer.html" %>
                            <% } %>

                                <script
                                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                                    crossorigin="anonymous"></script>
            </body>

            </html>