import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

export default function Routing({ userLocation, vendorLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLocation || !vendorLocation) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(vendorLocation.lat, vendorLocation.lng)
      ],
      lineOptions: {
        styles: [
          { color: "#3b82f6", weight: 6, opacity: 0.8 }, // Main blue route line
          { color: "white", weight: 2, opacity: 0.4 }  // Subtle inner line for gloss
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      },
      show: false, // Hides the itinerary panel
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: false, // We handle padding in MapAutoPan
      showAlternatives: false,
      containerClassName: 'hidden-itinerary', // Custom class to hide panel
      createMarker: () => null // We use our own custom markers in LiveTrackingMap
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, userLocation.lat, userLocation.lng, vendorLocation.lat, vendorLocation.lng]);

  return null;
}
