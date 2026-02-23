"use client";

import React, { useState } from "react";
import { MapPin, AlertTriangle, PartyPopper, Info, ShieldCheck, Plus, X, MessageSquare, ThumbsUp } from "lucide-react";

interface Alert {
  id: string;
  type: "DANGER" | "EVENT" | "INFO";
  title: string;
  description: string;
  location: string;
  severity: number;
  author: string;
  trustScore: number;
  verifications: number;
  time: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "DANGER",
    title: "Προσοχή: Ύποπτο φαγητό στο Πεδίον του Άρεως",
    description: "Εντοπίστηκαν ύποπτα κομμάτια κρέατος κοντά στην κεντρική είσοδο. Αποφύγετε το σημείο.",
    location: "Πεδίον του Άρεως, Αθήνα",
    severity: 5,
    author: "Mina_Admin",
    trustScore: 98,
    verifications: 12,
    time: "10 λεπτά πριν",
  },
  {
    id: "2",
    type: "EVENT",
    title: "Golden Retriever Meetup",
    description: "Κυριακάτικη βόλτα και παιχνίδι για όλα τα Goldens της γειτονιάς!",
    location: "Πάρκο Φλοίσβου",
    severity: 1,
    author: "Aris_Sk",
    trustScore: 85,
    verifications: 24,
    time: "2 ώρες πριν",
  },
];

export default function CommunityMap() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "DANGER": return "bg-red-100 text-red-700 border-red-200";
      case "EVENT": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "DANGER": return <AlertTriangle className="w-5 h-5" />;
      case "EVENT": return <PartyPopper className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative h-[600px] w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Fake Map Background */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/23.7275,37.9838,13,0/1200x600?access_token=YOUR_TOKEN')] bg-cover bg-center">
        {/* Mock Pins */}
        <button 
          onClick={() => setSelectedAlert(mockAlerts[0])}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-bounce text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
        >
          <MapPin className="w-10 h-10 fill-current" />
        </button>
        <button 
          onClick={() => setSelectedAlert(mockAlerts[1])}
          className="absolute top-1/2 left-1/4 animate-pulse text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
        >
          <MapPin className="w-8 h-8 fill-current" />
        </button>
      </div>

      {/* Overlay UI */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="text-blue-400 w-6 h-6" />
            PET SOCIAL GUARD
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Neighborhood Pulse • Live</p>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-900/50 transition-all active:scale-95 pointer-events-auto"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Left Sidebar - Recent Alerts */}
      <div className="absolute top-28 left-6 w-80 max-h-[450px] overflow-y-auto space-y-3 pointer-events-auto custom-scrollbar">
        {mockAlerts.map(alert => (
          <div 
            key={alert.id}
            onClick={() => setSelectedAlert(alert)}
            className="group bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 hover:border-white/20 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className={`p-2 rounded-lg border ${getTypeStyles(alert.type)}`}>
                {getIcon(alert.type)}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight group-hover:text-blue-300 transition">{alert.title}</h4>
                <p className="text-[10px] text-gray-500 uppercase font-medium">{alert.time} • {alert.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`h-2 w-full ${selectedAlert.type === 'DANGER' ? 'bg-red-500' : 'bg-purple-500'}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getTypeStyles(selectedAlert.type)}`}>
                  {selectedAlert.type}
                </span>
                <button onClick={() => setSelectedAlert(null)} className="text-gray-500 hover:text-white transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2 leading-tight">{selectedAlert.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{selectedAlert.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Author Trust</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-400">{selectedAlert.trustScore}%</span>
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Verifications</span>
                  <span className="text-lg font-bold text-green-400">{selectedAlert.verifications}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95">
                  <ThumbsUp className="w-4 h-4" /> ΕΠΙΒΕΒΑΙΩΝΩ
                </button>
                <button className="px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-blue-600/10 backdrop-blur-sm border-t border-white/5 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Protocol Active: All sectors secure</span>
        </div>
        <span className="text-[10px] text-gray-500">Mina OS v2.0</span>
      </div>
    </div>
  );
}
