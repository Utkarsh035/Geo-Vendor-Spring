<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%
response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");//HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevents caching at theproxyserver
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Locations Map</title>
     <%@include file="/WEB-INF/views/common/all_css.html"%>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css" integrity="sha512-q3eWabyZPc1XTCmF+8/LuE1ozpg5xxn7iO89yfSOd5/oKvyqLngoNGsx8jq92Y8eXJ/IRxQbEC+FGSYxtk2oiw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  
    <style>
        #map {
            height: 600px;
            width: 100%;
        }
        .search-container {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        .custom-marker i {
            font-size: 24px;
            color: red; /* Customize marker color */
        }
    </style>
</head>
<body>
<%@include file="/WEB-INF/views/user/user_header.html"%>
   <!--  <h1>User Locations</h1> -->
    
    <div class="search-container" style="margin-top: 60px;">
        <input type="text" id="search" placeholder="Search for a location..." />
        <button id="search-button" class="btn " style="background-color: #83afd4;">Search</button>
    </div>
    
    <div id="map" style="margin-top: 85px;"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        var circle;
        
        // Initialize the map (centered on India)
        var map = L.map('map').setView([20.5937, 78.9629], 5);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Function to create a custom icon with FontAwesome
        function createCustomIcon(iconClass) {
            return L.divIcon({
                html: "<i class='" + iconClass + "'></i>",
                className: 'custom-marker',
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            });
        }

        // Store user markers
        var userMarkers = [];

        <c:forEach var="user" items="${requestScope.usr}">
            var lat = parseFloat("${user.location_lat}");
            var lon = parseFloat("${user.location_long}");

            var marker = L.marker([lat, lon], {
                icon: createCustomIcon("fas fa-map-marker-alt") // Custom icon
            }).bindPopup('<b>${user.business_name}</b>');

            userMarkers.push({
                name: '${user.business_name}',
                description: '${user.business_name}',
                lat: lat,
                lon: lon,
                marker: marker
            });

            marker.addTo(map); // Ensure markers appear on initial load
        </c:forEach>

        // Function to perform text-to-speech
        function speakText(text) {
            var utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
        }

        // Function to calculate the distance between two points (Haversine formula)
        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of the Earth in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
        }

        // Function to search for a location
        document.getElementById('search-button').addEventListener('click', function() {
            var query = document.getElementById('search').value;
            var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query);
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        var result = data[0];
                        var searchLat = parseFloat(result.lat);  // Fixed key name
                        var searchLon = parseFloat(result.lon);  // Fixed key name

                        // Move the map to the searched location
                        map.setView([searchLat, searchLon], 12);

                        // Remove previous circle
                        if (circle) {
                            map.removeLayer(circle);
                        }

                        // Draw a circle with a 5km radius
                        circle = L.circle(
                            [searchLat, searchLon],
                            {"color": "#3388ff", "fillColor": "#3388ff", "fillOpacity": 0.4, "radius": 5000}
                        ).addTo(map);

                        // Clear all previous markers
                        userMarkers.forEach(user => {
                            map.removeLayer(user.marker);
                        });

                        // Display markers within 5km radius
                        userMarkers.forEach(user => {
                            var distance = calculateDistance(searchLat, searchLon, user.lat, user.lon);
                            if (distance <= 5) {
                                user.marker.addTo(map);

                                // Add click event for text-to-speech
                                user.marker.on('click', function() {
                                    speakText(user.description);
                                });
                            }
                        });
                    } else {
                        alert('Location not found. Please try again.');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    </script>
       </script>
<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
		crossorigin="anonymous"></script>
</body>
</html>
