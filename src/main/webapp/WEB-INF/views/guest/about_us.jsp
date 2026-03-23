<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>About Us</title>
        <%@include file="/WEB-INF/views/common/all_css.html" %>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
                integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
                crossorigin="anonymous" referrerpolicy="no-referrer"></script>

            <style>
                /* PLATINUM THEME OVERRIDES */
                body,
                .main-body {
                    background-color: #f8fafc !important;
                    color: #1e293b !important;
                }

                /* Background Wrapper */
                .img-container {
                    background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
                    min-height: 92vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 60px 20px;
                    position: relative;
                    overflow-x: hidden;
                    margin-top: 60px;
                }

                /* Background Map Pattern */
                .img-container::before {
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

                /* Text Animation */
                .fade-slide {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: fadeSlideIn 0.8s ease-out forwards;
                }

                .fade-slide.delay-1 {
                    animation-delay: 0.2s;
                }

                .fade-slide.delay-2 {
                    animation-delay: 0.4s;
                }

                @keyframes fadeSlideIn {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }

                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* About Box - Platinum Card Style */
                .about-box {
                    background: #ffffff;
                    border: 1px solid #f1f5f9;
                    border-radius: 24px;
                    padding: 50px;
                    box-shadow: 0 20px 40px -5px rgba(148, 163, 184, 0.15);
                    /* Premium Shadow */
                    text-align: center;
                    max-width: 900px;
                    margin: auto;
                    position: relative;
                    z-index: 2;
                }

                /* Typography */
                .about-box p {
                    font-family: 'Inter', sans-serif;
                    text-align: center;
                    font-weight: 500;
                    /* Lighter weight for clean look */
                    font-size: 1.15rem;
                    color: #475569;
                    /* Slate 600 */
                    line-height: 1.8;
                    margin-bottom: 25px;
                }

                .about-box p:last-child {
                    margin-bottom: 0;
                }

                /* Lead Paragraph */
                .about-box p:first-of-type {
                    color: #1e293b;
                    /* Slate 800 */
                    font-size: 1.35rem;
                    font-weight: 600;
                }

                /* Highlight Branding */
                .about-box strong {
                    color: #2563eb;
                    font-weight: 700;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .img-container {
                        padding: 40px 15px;
                    }

                    .about-box {
                        padding: 30px 20px;
                    }

                    .about-box p {
                        font-size: 1rem;
                    }

                    .about-box p:first-of-type {
                        font-size: 1.15rem;
                    }
                }
            </style>

            <script>
                $(document).ready(function () {
                    // add fade-slide animation classes
                    $("#img").addClass("fade-slide delay-1");
                    $("#para").addClass("fade-slide delay-2");
                });
            </script>
    </head>

    <body>
        <%@include file="/WEB-INF/views/common/nav_bar.html" %>

            <div class="img-container">
                <div class="container my-5">
                    <div class="row align-items-center">
                        <div class="col-12 col-md-10" id="para">
                            <div class="about-box">
                                <p>Welcome to GeoVendor, your go-to platform for finding essential services and
                                    businesses near you with ease. Whether you're looking for a shop, hospital, or any
                                    other service, GeoVendor helps you discover the best options based on your location.
                                </p>

                                <p>Our mission is to bridge the gap between service providers and customers by offering
                                    a seamless, user-friendly experience. With our interactive map and smart search
                                    filters, users can quickly locate nearby businesses, view important details like
                                    contact information and reviews, and get accurate directions.</p>

                                <p>For vendors, GeoVendor provides a powerful way to enhance visibility and connect with
                                    potential customers. Business owners can register their shops, hospitals, or other
                                    services, mark their exact location on the map, and manage their listings through an
                                    intuitive dashboard. They can also track interactions and communicate directly with
                                    users via WhatsApp.</p>

                                <p>At GeoVendor, we believe in making navigation effortless and supporting local
                                    businesses by helping them reach the right audience. Join us today and experience a
                                    smarter way to connect with the services you need!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <%@include file="/WEB-INF/views/common/footer.html" %>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                    crossorigin="anonymous"></script>
    </body>

    </html>