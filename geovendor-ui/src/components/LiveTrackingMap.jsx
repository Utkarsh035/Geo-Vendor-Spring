import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LiveTrackingMap.css';
import Routing from './Routing';

// Fix for default marker icons in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

// Custom Vendor Icon (Animated)
const createVendorIcon = (iconClass) => L.divIcon({
  className: 'custom-vendor-marker',
  html: `<div class="vendor-marker-container">
           <div class="vendor-icon-bg">
             <i class="${iconClass || 'fas fa-store'}"></i>
           </div>
           <div class="vendor-pulse"></div>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Helper component to auto-pan map when markers move
function MapAutoPan({ userPos, vendorPos }) {
  const map = useMap();
  useEffect(() => {
    if (userPos && vendorPos) {
      const bounds = L.latLngBounds([userPos, vendorPos]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (userPos) {
      map.setView(userPos, 15);
    } else if (vendorPos) {
      map.setView(vendorPos, 15);
    }
  }, [userPos, vendorPos, map]);
  return null;
}

export default function LiveTrackingMap({ userLocation, vendorLocation, businessName, businessIcon }) {
  const [vendorPos, setVendorPos] = useState(vendorLocation);
  const vIcon = createVendorIcon(businessIcon);

  // Smoothly update vendor position when it changes
  useEffect(() => {
    if (vendorLocation) {
        setVendorPos(vendorLocation);
    }
  }, [vendorLocation]);

  const center = userLocation || vendorLocation || [26.8467, 80.9462];

  return (
    <div className="live-map-wrapper">
      <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {userLocation && vendorPos && (
          <Routing 
            userLocation={userLocation} 
            vendorLocation={vendorPos} 
          />
        )}

        {userLocation && (
          <Marker position={userLocation} icon={DefaultIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {vendorPos && (
          <Marker position={vendorPos} icon={vIcon}>
            <Popup>{businessName} (Live)</Popup>
          </Marker>
        )}

        <MapAutoPan userPos={userLocation} vendorPos={vendorPos} />
      </MapContainer>
    </div>
  );
}
