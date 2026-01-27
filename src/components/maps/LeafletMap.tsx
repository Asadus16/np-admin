"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  center: [number, number];
  markerPosition: [number, number] | null;
  onLocationChange: (lat: number, lng: number) => void;
  triggerPan: number;
  restrictToUAE?: boolean; // Restrict map bounds to UAE only
}

// Fix for default marker icon in Leaflet with webpack/Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map click events
function MapClickHandler({ 
  onLocationChange, 
  restrictToUAE 
}: { 
  onLocationChange: (lat: number, lng: number) => void;
  restrictToUAE?: boolean;
}) {
  useMapEvents({
    click: (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      // Validate UAE bounds if restriction is enabled
      if (restrictToUAE) {
        const [sw, ne] = UAE_BOUNDS;
        if (lat < sw[0] || lat > ne[0] || lng < sw[1] || lng > ne[1]) {
          alert("Please select a location within the United Arab Emirates (UAE)");
          return;
        }
      }
      
      onLocationChange(lat, lng);
    },
  });
  return null;
}

// Component to control map view
function MapController({ 
  center, 
  triggerPan, 
  restrictToUAE 
}: { 
  center: [number, number]; 
  triggerPan: number;
  restrictToUAE?: boolean;
}) {
  const map = useMap();
  const prevTriggerPan = useRef(triggerPan);
  const hasSetUAEView = useRef(false);

  useEffect(() => {
    // Set initial UAE view if restriction is enabled
    if (restrictToUAE && !hasSetUAEView.current) {
      const bounds = L.latLngBounds(UAE_BOUNDS);
      map.fitBounds(bounds, { padding: [20, 20] });
      hasSetUAEView.current = true;
    } else if (triggerPan !== prevTriggerPan.current) {
      // Only pan to center if it's within UAE bounds when restricted
      if (restrictToUAE) {
        const [sw, ne] = UAE_BOUNDS;
        const [lat, lng] = center;
        if (lat >= sw[0] && lat <= ne[0] && lng >= sw[1] && lng <= ne[1]) {
          map.setView(center, Math.min(map.getZoom(), 15));
        }
      } else {
        map.setView(center, 15);
      }
      prevTriggerPan.current = triggerPan;
    }
  }, [map, center, triggerPan, restrictToUAE]);

  // Ensure map stays within UAE bounds
  useEffect(() => {
    if (!restrictToUAE) return;

    const checkBounds = () => {
      const bounds = map.getBounds();
      const uaeBounds = L.latLngBounds(UAE_BOUNDS);
      
      // If map view is outside UAE, fit to UAE bounds
      if (!uaeBounds.contains(bounds)) {
        map.fitBounds(uaeBounds, { padding: [20, 20] });
      }
    };

    map.on('moveend', checkBounds);
    map.on('zoomend', checkBounds);

    return () => {
      map.off('moveend', checkBounds);
      map.off('zoomend', checkBounds);
    };
  }, [map, restrictToUAE]);

  return null;
}

// Draggable marker component
function DraggableMarker({
  position,
  onPositionChange,
}: {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const latlng = marker.getLatLng();
          onPositionChange(latlng.lat, latlng.lng);
        }
      },
    }),
    [onPositionChange]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={customIcon}
    />
  );
}

// UAE boundaries for map restriction
const UAE_BOUNDS: [[number, number], [number, number]] = [
  [22.5, 51.0], // Southwest corner (minLat, minLng)
  [26.0, 56.4], // Northeast corner (maxLat, maxLng)
];

// UAE center point (Dubai area)
const UAE_CENTER: [number, number] = [24.4539, 54.3773];

export default function LeafletMap({
  center,
  markerPosition,
  onLocationChange,
  triggerPan,
  restrictToUAE = false,
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure component only renders on client side and DOM is ready
    if (typeof window !== "undefined") {
      // Small delay to ensure DOM is fully ready
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isMounted || typeof window === "undefined") {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  // Determine initial center and zoom based on restriction
  const initialCenter = restrictToUAE ? UAE_CENTER : center;
  const initialZoom = restrictToUAE ? 8 : (markerPosition ? 15 : 12);

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
      key={`map-${restrictToUAE ? 'uae' : center[0]}-${restrictToUAE ? 'restricted' : center[1]}-${isMounted}`}
      maxBounds={restrictToUAE ? UAE_BOUNDS : undefined}
      maxBoundsViscosity={restrictToUAE ? 1.0 : undefined}
      minZoom={restrictToUAE ? 7 : undefined}
      maxZoom={18}
    >
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapClickHandler onLocationChange={onLocationChange} restrictToUAE={restrictToUAE} />
      {markerPosition && (
        <DraggableMarker
          position={markerPosition}
          onPositionChange={restrictToUAE ? (lat, lng) => {
            const [sw, ne] = UAE_BOUNDS;
            if (lat < sw[0] || lat > ne[0] || lng < sw[1] || lng > ne[1]) {
              alert("Please select a location within the United Arab Emirates (UAE)");
              return;
            }
            onLocationChange(lat, lng);
          } : onLocationChange}
        />
      )}
      <MapController 
        center={markerPosition || center} 
        triggerPan={triggerPan} 
        restrictToUAE={restrictToUAE}
      />
    </MapContainer>
  );
}
