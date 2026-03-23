<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ page import="com.geovendor.entity.*,java.util.*" %>

        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Edit Business | GeoVendor</title>

            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                rel="stylesheet">
            <%@include file="/WEB-INF/views/common/all_css.html" %>

                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        background: #f8fafc;
                    }

                    .edit-wrapper {
                        background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 40px 15px;
                        margin-top: 60px;
                    }

                    .edit-card {
                        background: #fff;
                        padding: 35px;
                        border-radius: 24px;
                        box-shadow: 0 20px 40px -5px rgba(148, 163, 184, 0.15);
                        max-width: 500px;
                        width: 100%;
                    }

                    .field-label {
                        font-size: 0.8rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        color: #94a3b8;
                        margin-bottom: 4px;
                    }

                    .form-control {
                        border-radius: 12px;
                        background: #f8fafc;
                    }

                    .form-control:focus {
                        background: #fff;
                        border-color: #2563eb;
                        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                    }

                    .btn-submit {
                        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                        color: #fff;
                        padding: 14px 28px;
                        border-radius: 50px;
                        font-weight: 600;
                        border: none;
                    }

                    .btn-submit:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
                    }
                </style>
        </head>

        <body>

            <% String email=(String)session.getAttribute("sessionEmail"); if(email==null || session.isNew()){
                request.setAttribute("message","Please Login to Continue"); RequestDispatcher
                rd=request.getRequestDispatcher("/vendor/vendor_login.jsp"); rd.forward(request,response); return; }
                Business bs=(Business) request.getAttribute("business"); //=====GET VENDOR PROFILE FOR HEADER
                IMAGE=====Vendor v=(Vendor) request.getAttribute("vendor"); String uploadPath=request.getContextPath();
                String imagePath=uploadPath + "/" + (v !=null && v.getProfile_pic() !=null ? v.getProfile_pic()
                : "images/default.png" ); %>

                <%@include file="/WEB-INF/views/vendor/vendor_header.html" %>

                    <div class="edit-wrapper">
                        <div class="edit-card">

                            <h4 class="text-center mb-4">Edit Business Details</h4>

                            <form action="/vendor/business/edit" method="post">

                                <p class="text-muted text-center mb-3">📧 Email: <%= email %>
                                </p>

                                <div class="mb-3">
                                    <div class="field-label">Business Name</div>
                                    <input type="text" name="name" class="form-control"
                                        value="<%= bs!=null ? bs.getBusiness_name() : "" %>" required>
                                </div>

                                <div class="mb-3">
                                    <div class="field-label">Phone</div>
                                    <input type="tel" name="phone" class="form-control"
                                        value="<%= bs!=null ? bs.getPhone() : "" %>" required>
                                </div>

                                <div class="mb-3">
                                    <div class="field-label">GST No</div>
                                    <input type="text" name="gst" class="form-control"
                                        value="<%= bs!=null ? bs.getGst_no() : "" %>" required>
                                </div>

                                <div class="mb-3">
                                    <div class="field-label">Address</div>
                                    <textarea name="address" class="form-control"
                                        required><%= bs!=null ? bs.getAddress() : "" %></textarea>
                                </div>

                                <div class="text-center">
                                    <button class="btn-submit">Update Business</button>
                                </div>

                            </form>
                        </div>
                    </div>

                    <%@ include file="/WEB-INF/views/common/footer.html" %>

                        <script
                            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>

        </html>