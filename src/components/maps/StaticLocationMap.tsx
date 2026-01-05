"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface StaticLocationMapProps {
  latitude: number;
  longitude: number;
  height?: string;
}

const MapComponent = dynamic(
  () => import("./StaticLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function StaticLocationMap({
  latitude,
  longitude,
  height = "200px",
}: StaticLocationMapProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height }}>
      <MapComponent
        latitude={latitude}
        longitude={longitude}
      />
    </div>
  );
}
