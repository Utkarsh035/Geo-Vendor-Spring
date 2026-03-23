<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <meta http-equiv="Cache-Control" content="no-store" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Login | GeoVendor</title>

        <!-- Google Fonts: Inter -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet">

        <%@include file="/WEB-INF/views/common/all_css.html" %>
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

            <style>
                /* ===== Platinum Toast ===== */
                .toast-platinum {
                    position: fixed;
                    top: 100px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-20px);
                    min-width: 280px;
                    max-width: 400px;
                    padding: 16px 28px;
                    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                    color: #fff;
                    border-radius: 14px;
                    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
                    opacity: 0;
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                    text-align: center;
                    font-size: 15px;
                    font-weight: 500;
                }

                .toast-platinum.show {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }

                /* ===== Background Wrapper ===== */
                .login-wrapper {
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

                /* Subtle Map Background */
                .login-wrapper::before {
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

                /* ===== Form Card ===== */
                .login-card {
                    background: #ffffff;
                    box-shadow: 0 20px 40px -5px rgba(148, 163, 184, 0.15);
                    border: 1px solid #f1f5f9;
                    border-radius: 24px;
                    padding: 45px 40px;
                    position: relative;
                    z-index: 2;
                    max-width: 460px;
                    width: 100%;
                    animation: fadeUp 0.7s ease-out;
                }

                .login-card h2 {
                    font-family: 'Inter', sans-serif;
                    color: #0f172a;
                    font-weight: 800;
                    letter-spacing: -1px;
                    margin-bottom: 2rem;
                    font-size: 1.75rem;
                }

                /* ===== Form Fields ===== */
                .login-card .form-floating>.form-control {
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    border-radius: 12px;
                    font-family: 'Inter', sans-serif;
                }

                .login-card .form-floating>.form-control:focus {
                    background: white;
                    border-color: #2563eb;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                .login-card .form-floating>label {
                    color: #64748b;
                    font-family: 'Inter', sans-serif;
                }

                /* ===== Submit Button ===== */
                .btn-platinum-submit {
                    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                    color: white;
                    padding: 14px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-family: 'Inter', sans-serif;
                    border: none;
                    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
                    transition: all 0.3s ease;
                    font-size: 15px;
                    letter-spacing: 0.3px;
                }

                .btn-platinum-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
                    color: white;
                }

                .btn-platinum-submit i {
                    margin-right: 6px;
                }

                /* ===== Animation ===== */
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

                /* ===== Responsive ===== */
                @media (max-width: 768px) {
                    .login-card {
                        padding: 30px 24px;
                        margin: 0 10px;
                    }

                    .login-wrapper {
                        padding: 20px 10px;
                    }
                }
            </style>
    </head>

    <body>
        <div class="main-body">
            <%@include file="/WEB-INF/views/common/nav_bar.html" %>

                <div class="login-wrapper">
                    <div class="login-card">
                        <h2 class="text-center">User Login</h2>
                        <form action="/user/login" method="post" class="needs-validation" novalidate>

                            <!-- Email -->
                            <div class="form-floating mb-3">
                                <input type="email" name="email" placeholder="Enter Email" class="form-control"
                                    required>
                                <label for="email">Email-ID</label>
                                <div class="invalid-feedback">Please Provide Your Email</div>
                            </div>

                            <!-- Password -->
                            <div class="form-floating mb-3">
                                <input type="password" name="password" placeholder="Enter password" class="form-control"
                                    required>
                                <label for="password">Enter Password</label>
                                <div class="invalid-feedback">Please Enter Password</div>
                            </div>

                            <!-- Submit -->
                            <div class="text-center mb-3">
                                <button class="btn-platinum-submit w-100">
                                    <i class="fas fa-lock"></i> Sign In
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
        </div>

        <%@ include file="/WEB-INF/views/common/footer.html" %>
            <script src="/js/validation.js"></script>
            <script>
<%
                    String mess = (String) request.getAttribute("message");
String mess1 = (String) session.getAttribute("logout_msg");
                if (mess1 != null) session.removeAttribute("logout_msg");
%>

<% if (mess != null || mess1 != null) { %>
                    function showToast(message) {
                        let toast = document.createElement('div');
                        toast.className = 'toast-platinum';
                        toast.innerText = message;
                        document.body.appendChild(toast);

                        setTimeout(() => { toast.classList.add('show'); }, 100);

                        setTimeout(() => {
                            toast.classList.remove('show');
                            setTimeout(() => { toast.remove(); }, 700);
                        }, 5000);
                    }

                    <% if (mess != null) { %>
                        showToast('<%= mess %>');
<% } %>

<% if (mess1 != null) { %>
                        showToast('<%= mess1 %>');
<% } %>

<% } %>
            </script>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                crossorigin="anonymous"></script>
    </body>

    </html>