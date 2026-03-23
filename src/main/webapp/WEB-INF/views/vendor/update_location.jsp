<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ page import="com.geovendor.entity.*,java.util.*" %>
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Update Location | GeoVendor</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                rel="stylesheet">
            <%@include file="/WEB-INF/views/common/all_css.html" %>
                <style>
                    body {
                        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                        background-color: #f8fafc;
                        margin: 0;
                        padding: 0;
                    }

                    .map-page-header {
                        text-align: center;
                        padding: 80px 0 10px;
                        margin-top: 60px;
                    }

                    .map-page-header h1 {
                        font-family: 'Inter', sans-serif;
                        font-size: 1.75rem;
                        font-weight: 800;
                        color: #0f172a;
                        letter-spacing: -1px;
                        margin-bottom: 0.3rem;
                    }

                    .map-page-header p {
                        color: #64748b;
                        font-size: 0.95rem;
                        margin-bottom: 12px;
                    }

                    .search-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        max-width: 700px;
                        margin: 0 auto 14px;
                        padding: 0 20px;
                        flex-wrap: wrap;
                        opacity: 0;
                        transform: translateY(-10px);
                        animation: fadeSlideIn 0.6s ease-out forwards 0.1s;
                    }

                    .search-container input {
                        flex: 1;
                        padding: 12px 20px;
                        font-size: 15px;
                        font-family: 'Inter', sans-serif;
                        border: 1px solid #e2e8f0;
                        border-radius: 50px;
                        background: #f8fafc;
                        outline: none;
                        transition: all 0.3s ease;
                    }

                    .search-container input:focus {
                        border-color: #2563eb;
                        background: white;
                        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                    }

                    .search-container button,
                    .btn-platinum-submit {
                        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                        color: white;
                        padding: 12px 24px;
                        border: none;
                        border-radius: 50px;
                        cursor: pointer;
                        font-weight: 600;
                        font-family: 'Inter', sans-serif;
                        font-size: 14px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
                        white-space: nowrap;
                    }

                    .search-container button:hover,
                    .btn-platinum-submit:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
                    }

                    #map {
                        height: 65vh;
                        width: 92%;
                        border: 1px solid #e2e8f0;
                        border-radius: 20px;
                        box-shadow: 0 10px 25px -5px rgba(148, 163, 184, 0.15);
                        margin: 10px auto 40px;
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeSlideIn 0.7s ease-out forwards 0.3s;
                    }

                    .submit-row {
                        text-align: center;
                        margin-bottom: 16px;
                        opacity: 0;
                        animation: fadeSlideIn 0.6s ease-out forwards 0.2s;
                    }

                    @keyframes fadeSlideIn {
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
        </head>

        <body>

            <% String mess=(String) request.getAttribute("mess"); if (mess !=null) { %>
                <div class="alert alert-info alert-dismissible fade show" role="alert"
                    style="margin-top: 70px; position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 9999; border-radius: 12px;">
                    <h5>
                        <%= mess %>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <% } %>

                    <% String email=(String)session.getAttribute("sessionEmail"); if(email==null||session.isNew()){
                        request.setAttribute("message", "Please Login to Continue" ); RequestDispatcher
                        rd=request.getRequestDispatcher("user/user_login.jsp"); rd.forward(request, response); } else {
                        Vendor v=(Vendor) request.getAttribute("vendor"); String uploadPath=request.getContextPath();
                        String imagePath=uploadPath + "/" + v.getProfile_pic(); %>
                        <%@include file="/WEB-INF/views/vendor/vendor_header.html" %>

                            <div class="map-page-header">
                                <h1>Update Location</h1>
                                <p>Search for your updated business location and click on the map to pin it</p>
                            </div>

                            <div class="search-container">
                                <input type="text" id="search" placeholder="Search for a location..." />
                                <button id="search-button"><i class="fas fa-search"></i> Search</button>
                            </div>

                            <form method="POST" onsubmit="return checkValue()" action="/vendor/location/update">
                                <input type="text" hidden id="long" name="long">
                                <input type="text" hidden id="lat" name="lat">
                                <div class="submit-row">
                                    <button type="submit" class="btn-platinum-submit"><i class="fas fa-map-pin"></i>
                                        Update Location</button>
                                </div>
                            </form>

                            <div id="map" class="mb-5"></div>

                            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                            <script>
                                var marker;
                                var clickedLat, clickedLng;
                                var long = document.getElementById("long");
                                var lati = document.getElementById("lat");

                                var map = L.map('map').setView([20.5937, 78.9629], 5);

                                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
                                }).addTo(map);

                                document.getElementById('search-button').addEventListener('click', function () {
                                    var query = document.getElementById('search').value;
                                    var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query);

                                    fetch(url)
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.length > 0) {
                                                var result = data[0];
                                                map.setView([result.lat, result.lon], 13);

                                                map.eachLayer(function (layer) {
                                                    if (layer instanceof L.Marker) map.removeLayer(layer);
                                                });

                                                map.on('click', function (e) {
                                                    clickedLat = e.latlng.lat;
                                                    clickedLng = e.latlng.lng;
                                                    if (marker) map.removeLayer(marker);
                                                    marker = L.marker([clickedLat, clickedLng]).addTo(map)
                                                        .bindPopup('Location selected!').openPopup();
                                                    long.value = clickedLng;
                                                    lati.value = clickedLat;
                                                });
                                            } else {
                                                alert('Location not found. Please try again.');
                                            }
                                        })
                                        .catch(error => console.error('Error:', error));
                                });

                                function checkValue() {
                                    if (document.getElementById("lat").value === "" || document.getElementById("long").value === "") {
                                        alert("Please choose a location on the map.");
                                        return false;
                                    }
                                    return true;
                                }
<% } %>
                            </script>
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                                crossorigin="anonymous"></script>
        </body>

        </html>