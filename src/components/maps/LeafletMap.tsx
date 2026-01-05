"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  center: [number, number];
  markerPosition: [number, number] | null;
  onLocationChange: (lat: number, lng: number) => void;
  triggerPan: number;
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
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to control map view
function MapController({ center, triggerPan }: { center: [number, number]; triggerPan: number }) {
  const map = useMap();
  const prevTriggerPan = useRef(triggerPan);

  useEffect(() => {
    if (triggerPan !== prevTriggerPan.current) {
      map.setView(center, 15);
      prevTriggerPan.current = triggerPan;
    }
  }, [map, center, triggerPan]);

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

export default function LeafletMap({
  center,
  markerPosition,
  onLocationChange,
  triggerPan,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={markerPosition ? 15 : 12}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapClickHandler onLocationChange={onLocationChange} />
      {markerPosition && (
        <DraggableMarker
          position={markerPosition}
          onPositionChange={onLocationChange}
        />
      )}
      <MapController center={markerPosition || center} triggerPan={triggerPan} />
    </MapContainer>
  );
}
