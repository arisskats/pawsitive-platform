"use client";

import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet icon fix
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface Spot {
  id: string;
  name?: string;
  address?: string;
  latitude: number;
  longitude: number;
}

export default function Map({ spots }: { spots: Spot[] }) {
  const center: [number, number] = [37.9838, 23.7278];

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200">
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <ZoomControl position="bottomright" />
        {spots.map((spot) => (
          <Marker 
            key={spot.id} 
            position={[spot.latitude, spot.longitude]}
            icon={icon}
          >
            <Popup>
              <strong>{spot.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
