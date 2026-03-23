<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@page import="com.geovendor.entity.*,java.util.*" %>
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Business Details | GeoVendor</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                rel="stylesheet">
            <%@include file="/WEB-INF/views/common/all_css.html" %>
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <style>
                    body {
                        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                    }

                    .details-wrapper {
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

                    .details-wrapper::before {
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

                    .details-card {
                        background: #ffffff;
                        box-shadow: 0 20px 40px -5px rgba(148, 163, 184, 0.15);
                        border: 1px solid #f1f5f9;
                        border-radius: 24px;
                        padding: 45px 40px;
                        position: relative;
                        z-index: 2;
                        max-width: 600px;
                        width: 100%;
                        animation: fadeUp 0.7s ease-out;
                    }

                    .details-card h2 {
                        font-family: 'Inter', sans-serif;
                        color: #0f172a;
                        font-weight: 800;
                        letter-spacing: -1px;
                        margin-bottom: 2rem;
                        font-size: 1.75rem;
                    }

                    .details-card .input-group-text {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        color: #64748b;
                        border-radius: 12px 0 0 12px;
                    }

                    .details-card .input-group .form-control,
                    .details-card .input-group .form-select {
                        border-radius: 0 12px 12px 0;
                    }

                    .details-card .form-floating>.form-control,
                    .details-card .form-floating>textarea.form-control,
                    .details-card .form-select,
                    .details-card .form-control {
                        border: 1px solid #e2e8f0;
                        background: #f8fafc;
                        border-radius: 12px;
                        font-family: 'Inter', sans-serif;
                    }

                    .details-card .form-floating>.form-control:focus,
                    .details-card .form-floating>textarea.form-control:focus,
                    .details-card .form-select:focus,
                    .details-card .form-control:focus {
                        background: white;
                        border-color: #2563eb;
                        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                    }

                    .details-card .form-floating>label {
                        color: #64748b;
                        font-family: 'Inter', sans-serif;
                    }

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

                    @media (max-width: 768px) {
                        .details-card {
                            padding: 30px 20px;
                            margin: 0 10px;
                        }
                    }
                </style>
        </head>

        <body>
            <div class="details-wrapper">
                <% String email=(String)session.getAttribute("sessionEmail"); if(email==null||session.isNew()){
                    request.setAttribute("message","Please Login to Continue"); RequestDispatcher
                    rd=request.getRequestDispatcher("/vendor/vendor_login.jsp"); rd.forward(request, response); } else {
                    Vendor v=(Vendor) request.getAttribute("vendor"); String uploadPath=request.getContextPath(); String
                    imagePath=uploadPath+"/"+v.getProfile_pic(); %>
                    <%@include file="/WEB-INF/views/vendor/vendor_header.html" %>

                        <div class="details-card">
                            <h2 class="text-center">Business Details</h2>
                            <form action="/vendor/business/add" method="post" novalidate class="needs-validation"
                                enctype="multipart/form-data">

                                <div class="mb-3 input-group">
                                    <span class="input-group-text"><i class="far fa-address-card"></i></span>
                                    <div class="form-floating w-75">
                                        <input type="text" name="name" placeholder="Business Name" class="form-control"
                                            required>
                                        <label>Business Name</label>
                                        <div class="invalid-feedback">Please Provide Your Business Name</div>
                                    </div>
                                </div>

                                <div class="mb-3 input-group">
                                    <span class="input-group-text"><i class="fas fa-list"></i></span>
                                    <select name="category" class="form-select" required>
                                        <option value="" selected disabled>Business Category</option>
                                        <option value="shop">Shop</option>
                                        <option value="school">School</option>
                                        <option value="hospital">Hospital</option>
                                        <option value="hotel">Hotel</option>
                                        <option value="restaurant">Restaurant</option>
                                        <option value="private_office">Private Office</option>
                                        <option value="other">Others..</option>
                                    </select>
                                    <div class="invalid-feedback">Please Provide Category</div>
                                </div>

                                <div class="mb-3 input-group">
                                    <span class="input-group-text"><i class="far fa-comment"></i></span>
                                    <div class="form-floating">
                                        <textarea class="form-control" placeholder="Description" name="description"
                                            required></textarea>
                                        <label>Description</label>
                                        <div class="invalid-feedback">Please Provide Description</div>
                                    </div>
                                </div>

                                <div class="mb-3 input-group">
                                    <span class="input-group-text"><i class="fas fa-phone"></i></span>
                                    <div class="form-floating">
                                        <input type="text" name="phone" placeholder="Phone" class="form-control"
                                            required>
                                        <label>Phone-No</label>
                                        <div class="invalid-feedback">Please Provide Your Phone-No</div>
                                    </div>
                                </div>

                                <div class="mb-3 input-group">
                                    <span class="input-group-text"><i class="fa fa-home"></i></span>
                                    <div class="form-floating">
                                        <textarea class="form-control" placeholder="Address" name="address"
                                            required></textarea>
                                        <label>Address</label>
                                        <div class="invalid-feedback">Please Provide Your Address</div>
                                    </div>
                                </div>

                                <div class="mb-3 input-group">
                                    <span class="input-group-text"><i class="fas fa-receipt"></i></span>
                                    <div class="form-floating">
                                        <input type="tel" name="gst" placeholder="GST" class="form-control" required>
                                        <label>GST-No</label>
                                        <div class="invalid-feedback">Please Provide Your GST-No</div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <div class="form-floating">
                                        <input type="file" name="business_photo" class="form-control" required>
                                        <label>Business Photo</label>
                                        <div class="invalid-feedback">Please Select Photo</div>
                                    </div>
                                </div>

                                <div class="text-center mb-3">
                                    <button type="submit" class="btn-platinum-submit w-100"><i class="fas fa-plus"></i>
                                        Submit</button>
                                </div>
                            </form>
                        </div>
            </div>

            <%@ include file="/WEB-INF/views/common/footer.html" %>
                <script src="/js/validation.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                    crossorigin="anonymous"></script>
                <% } %>
        </body>

        </html>