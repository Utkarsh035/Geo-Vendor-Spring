<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.geovendor.entity.*,java.util.*" %>
<%
response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
response.setHeader("Pragma","no-cache");
response.setDateHeader ("Expires", 0);
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Map | GeoVendor</title>

    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <%@include file="/WEB-INF/views/common/all_css.html"%>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    
   <style>
    body {
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        background-color: #f8fafc;
    }

    /* ===== Page Header ===== */
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

    /* ===== Map Container ===== */
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

    /* ===== Search & Location Row ===== */
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
    .btn-location {
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
    .btn-location:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
    }

    /* My Location button inherits .btn-location styles above */

    /* Custom marker icon */
    .custom-marker i {
        font-size: 18px;
        color: #c43d3d;
    }

    /* Profile image in popup */
    .profile-img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 5px;
    }

    /* ===== Animations ===== */
    @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>

</head>
<body>
<div class="main-body">
<%
	String email = (String) session.getAttribute("sessionEmail");
	if (email == null || session.isNew()) {
		request.setAttribute("message", "Please Login to Continue");
		RequestDispatcher rd = request.getRequestDispatcher("/user/user_login.jsp");
		rd.forward(request, response);
	} else {
		User u = (User) request.getAttribute("user");
		String uploadPath = request.getContextPath();
		System.out.println(uploadPath);
		String imagePath = uploadPath + "/" + u.getProfile_pic();
	%>
<%@include file="/WEB-INF/views/user/user_header.html"  %>

    <div class="map-page-header">
        <h1>Explore Vendors</h1>
        <p>Discover local businesses around your area</p>
    </div>

    <div class="search-container">
        <input type="text" id="search" placeholder="Search for a location..." />
        <button id="search-button"><i class="fas fa-search"></i> Search</button>
        <button class="btn-location" id="current-location-button"><i class="fas fa-crosshairs"></i> My Location</button>
    </div>

    <div id="map" class="mb-5"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        var circle;
        var userLocationMarker;
        var map = L.map('map').setView([20.5937, 78.9629], 5); 

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        function createCustomIcon(iconClass) {
            return L.divIcon({
                html: "<i class='"+iconClass+"'></i>",
                className: 'custom-marker',
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            });
        }
        
        var userMarkers = [];
        
        <c:forEach var="user" items="${bData}">
        <c:set var="photoPath" value="${fn:replace(user.business_photo, '\\\\', '/')}" />


            var googleMapsLink = `https://www.google.com/maps?q=${user.location_lat},${user.location_long}`;
            
            var marker = L.marker([${user.location_lat}, ${user.location_long}], {
                icon: createCustomIcon('${user.business_icon}')
            }).bindPopup(
                "<div style='text-align:center;'>" +
                    "<img src='${pageContext.request.contextPath}/${photoPath}' class='profile-img' alt='Business Photo'>" +
                    "<br><b><c:out value='${user.business_name}' /></b><br>" +
                    "<a href='" + googleMapsLink + "' target='_blank'>Follow on Google map <i class='fas fa-map-marker-alt'></i></a><br>" +
                    "<a href='/user/business-view?email=${user.email}' target='_blank'>View Details</a>" +
                "</div>"
            );

            userMarkers.push({
                name: '${user.business_name}',
                description: '${user.description}',
                lat: ${user.location_lat},
                log: ${user.location_long},
                marker: marker
            });
        </c:forEach>
        
        function speakText(text) {
            var utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
        }

        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }
        
        document.getElementById('current-location-button').addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var userLat = position.coords.latitude;
                    var userLon = position.coords.longitude;
                    map.setView([userLat, userLon], 12);
                    if (circle) {
                        map.removeLayer(circle);
                    }
                    circle = L.circle(
                        [userLat, userLon],
                        { color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.15, radius: 3000 }
                    ).addTo(map);
                    if (userLocationMarker) {
                        map.removeLayer(userLocationMarker);
                    }
                    userLocationMarker = L.marker([userLat, userLon]).addTo(map)
                        .bindPopup("<b>You are here!</b>").openPopup();
                    userMarkers.forEach(function(user) {
                        map.removeLayer(user.marker);
                    });
                    userMarkers.forEach(function(user) {
                        var distance = calculateDistance(userLat, userLon, user.lat, user.log);
                        if (distance <= 5) {
                            user.marker.addTo(map);
                        }
                    });
                }, function(error) {
                    alert("Geolocation error: " + error.message);
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        });
        
        // Search functionality
        document.getElementById('search-button').addEventListener('click', function() {
            var query = document.getElementById('search').value;
            var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query);
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        var result = data[0];
                        var searchLat = result.lat;
                        var searchLon = result.lon;

                        map.setView([searchLat, searchLon], 12);

                        if (circle) {
                            map.removeLayer(circle);
                        }

                        circle = L.circle(
                            [searchLat, searchLon],
                            { color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.15, radius: 10000 }
                        ).addTo(map);

                        userMarkers.forEach(user => map.removeLayer(user.marker));

                        if (userLocationMarker) {
                            map.removeLayer(userLocationMarker);
                        }

                        userMarkers.forEach(user => {
                            var distance = calculateDistance(searchLat, searchLon, user.lat, user.log);
                            if (distance <= 10) {
                                user.marker.addTo(map);
                                user.marker.on('click', function() {
                                    speakText(user.description); 
                                });
                            }
                        });
                    } else {
                        alert('Location not found. Try again.');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
        
    </script>
    
    </div>
    <%@ include file="/WEB-INF/views/common/footer.html"%>
    <script src="/js/validation.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
		crossorigin="anonymous"></script>
		<% } %>
		
</body>
</html>
