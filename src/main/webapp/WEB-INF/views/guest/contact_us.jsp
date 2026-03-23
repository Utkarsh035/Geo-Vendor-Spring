<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>Contact Us</title>

        <style>
            /* PLATINUM THEME OVERRIDES */
            body,
            .main-body {
                background-color: #f8fafc !important;
                color: #1e293b !important;
            }

            /* Background Wrapper */
            .img-cont {
                background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
                min-height: 92vh;
                /* Adjusted for navbar */
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px 15px;
                position: relative;
                overflow-x: hidden;
                margin-top: 60px;
                /* Navbar offset */
            }

            /* Background Map Pattern (Subtle) */
            .img-cont::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url("/images/bg_map.png") no-repeat center center/cover;
                opacity: 0.25;
                /* Increased visibility */
                filter: grayscale(15%);
                /* Slight color */
                pointer-events: none;
            }

            /* Main Form Card */
            .main-cont {
                background: #ffffff;
                box-shadow: 0 10px 25px -5px rgba(148, 163, 184, 0.15);
                /* Soft Platinum Shadow */
                border: 1px solid #f1f5f9;
                border-radius: 20px;
                padding: 40px;
                position: relative;
                z-index: 2;
                max-width: 600px;
                margin: 0 auto;
                animation: fadeUp 0.6s ease-out;
            }

            .main-cont h2 {
                color: #0f172a;
                font-weight: 800;
                letter-spacing: -1px;
                margin-bottom: 2rem;
            }

            /* Form Fields */
            .form-floating>.form-control {
                border: 1px solid #e2e8f0;
                background: #f8fafc;
                border-radius: 12px;
            }

            .form-floating>.form-control:focus {
                background: white;
                border-color: #2563eb;
                box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
            }

            .form-floating>label {
                color: #64748b;
            }

            /* Submit Button - Platinum Style */
            .btn-submit {
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                color: white;
                padding: 14px;
                border-radius: 50px;
                font-weight: 600;
                border: none;
                box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
                transition: all 0.3s ease;
            }

            .btn-submit:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
                color: white;
            }

            @keyframes fadeUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>

        <%@include file="/WEB-INF/views/common/all_css.html" %>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                function checkAlpha(event) {
                    let data = event.target.value;
                    const regEx = /^[a-zA-Z ]*$/;
                    if (!regEx.test(data)) {
                        event.target.value = data.replace(/[^a-zA-Z ]/g, '');
                        Swal.fire({ title: "Format Error", text: "Only Alphabets are allowed", icon: "error" });
                    }
                }

                function checkDigit(event) {
                    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
                    if (allowedKeys.includes(event.key)) return;

                    let data = event.target.value;
                    if (data.length >= 10) {
                        Swal.fire({ title: "Limit Reached", text: "Only 10 digits are allowed", icon: "warning" });
                        event.preventDefault();
                        return;
                    }

                    if (!/^[0-9]*$/.test(data + event.key)) {
                        Swal.fire({ title: "Format Error", text: "Only Digits are allowed", icon: "error" });
                        event.preventDefault();
                    }
                }
            </script>
    </head>

    <body>
        <div class="main-body">
            <%@include file="/WEB-INF/views/common/nav_bar.html" %>

                <% String mess=(String) request.getAttribute("message"); if (mess !=null) { %>
                    <div class="alert alert-info alert-dismissible fade show" role="alert">
                        <h4>
                            <%=mess%>
                        </h4>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    <% } %>
                        <div class="img-cont">
                            <div class="container my-5">
                                <div class="main-cont">
                                    <h2 class="text-center mb-4">Contact Us</h2>
                                    <form action="/contact" method="post" novalidate
                                        class="needs-validation">
                                        <!-- Name -->
                                        <div class="form-floating w-100 mb-3">
                                            <input type="text" name="name" placeholder="Enter Name" class="form-control"
                                                required oninput="checkAlpha(event)">
                                            <label for="name">Name</label>
                                            <div class="invalid-feedback">Please provide your name</div>
                                        </div>

                                        <!-- Email -->
                                        <div class="form-floating w-100 mb-3">
                                            <input type="email" name="email" placeholder="Enter Email"
                                                class="form-control" required>
                                            <label for="email">Email-ID</label>
                                            <div class="invalid-feedback">Please provide your email</div>
                                        </div>

                                        <!-- Phone -->
                                        <div class="form-floating w-100 mb-3">
                                            <input type="text" name="phone" placeholder="Enter Phone No"
                                                class="form-control" required maxlength="10"
                                                onkeydown="checkDigit(event)">
                                            <label for="phone">Phone-No</label>
                                            <div class="invalid-feedback">Please provide your phone number</div>
                                        </div>

                                        <!-- Query -->
                                        <div class="form-floating w-100 mb-3">
                                            <textarea class="form-control" placeholder="Your Query" name="qurey"
                                                required></textarea>
                                            <label for="qurey">Your Query</label>
                                            <div class="invalid-feedback">Please enter your query</div>
                                        </div>

                                        <!-- Submit -->
                                        <div class="text-center mb-3">
                                            <button class="btn-submit w-100"><i class="fas fa-lock"></i> Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
        </div>

        <%@ include file="/WEB-INF/views/common/footer.html" %>

            <script src="/js/validation.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                crossorigin="anonymous"></script>
    </body>

    </html>