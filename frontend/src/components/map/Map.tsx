"use client";

import { MapContainer, Marker, Popup, TileLayer, useMapEvents, ZoomControl } from "react-leaflet";
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

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onMapClick?.(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export default function Map({ spots, onMapClick }: { spots: Spot[]; onMapClick?: (lat: number, lng: number) => void }) {
  const center: [number, number] = [37.9838, 23.7278];

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <ZoomControl position="bottomright" />
        <MapClickHandler onMapClick={onMapClick} />
        {spots.map((spot) => (
          <Marker key={spot.id} position={[spot.latitude, spot.longitude]} icon={icon}>
            <Popup>
              <strong>{spot.name}</strong>
              {spot.address && <div>{spot.address}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
