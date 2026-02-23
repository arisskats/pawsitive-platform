"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPinned } from "lucide-react";

interface Spot {
  id: string;
  name?: string;
  address?: string;
  latitude: number;
  longitude: number;
}

const LeafletMap = dynamic(() => import("@/src/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
      <p className="text-slate-500">Loading map components...</p>
    </div>
  ),
});

export default function MapPage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch("http://localhost:3001/spots");
        if (response.ok) {
          const data = await response.json();
          setSpots(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8 text-gray-900">
      <header className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <MapPinned /> Dog Parks Map
        </h1>
        <p className="text-gray-500 text-sm mt-1">Explore pet-friendly spots around you.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 underline decoration-blue-500 underline-offset-4">
            Nearby Locations
          </h2>
          <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-sm text-slate-400">Loading list...</p>
            ) : spots.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No spots found.</p>
            ) : (
              spots.map((spot) => (
                <div key={spot.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition">
                  <h3 className="font-bold text-gray-800">{spot.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{spot.address || "Athens, Greece"}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          <LeafletMap spots={spots} />
        </div>
      </div>
    </div>
  );
}
