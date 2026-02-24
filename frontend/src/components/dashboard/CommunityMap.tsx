"use client";

import React, { useState } from "react";
import { MapPin, AlertTriangle, Calendar, Info, Shield, Plus, X, MessageSquare, ThumbsUp, Map as MapIcon } from "lucide-react";

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
    title: "Προσοχή: Ύποπτα ευρήματα στο Πεδίον του Άρεως",
    description: "Εντοπίστηκαν ύποπτα κομμάτια τροφής κοντά στην είσοδο της οδού Μαυρομματαίων. Παρακαλούμε προσέχετε τα ζωάκια σας.",
    location: "Πεδίον του Άρεως, Αθήνα",
    severity: 5,
    author: "PetGuard_Official",
    trustScore: 99,
    verifications: 15,
    time: "15 λεπτά πριν",
  },
  {
    id: "2",
    type: "EVENT",
    title: "Συγκέντρωση Φιλόζωων Γλυφάδας",
    description: "Κυριακάτικη βόλτα για κοινωνικοποίηση σκύλων. Όλες οι ράτσες ευπρόσδεκτες!",
    location: "Πάρκο Φλοίσβου",
    severity: 1,
    author: "Aris_Sk",
    trustScore: 88,
    verifications: 32,
    time: "1 ώρα πριν",
  },
];

export default function CommunityMap() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "DANGER": return "bg-red-50 text-red-600 border-red-100";
      case "EVENT": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "DANGER": return <AlertTriangle className="w-5 h-5" />;
      case "EVENT": return <Calendar className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative h-[650px] w-full bg-slate-50 rounded-2xl overflow-hidden shadow-xl border border-gray-200 font-sans">
      {/* Real Map Layer (Placeholder for Leaflet/Google Maps) */}
      <div className="absolute inset-0 bg-slate-200">
        <div className="w-full h-full flex items-center justify-center text-slate-400 gap-2 bg-[#f8f9fa]">
             <MapIcon className="w-6 h-6" />
             <span className="font-medium">Διαδραστικός Χάρτης Περιοχής</span>
        </div>
        
        {/* Map Pins */}
        <button 
          onClick={() => setSelectedAlert(mockAlerts[0])}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 transition-transform hover:scale-110 text-red-500"
        >
          <MapPin className="w-12 h-12 drop-shadow-md" />
        </button>
        <button 
          onClick={() => setSelectedAlert(mockAlerts[1])}
          className="absolute top-1/2 left-1/3 transition-transform hover:scale-110 text-blue-500"
        >
          <MapPin className="w-10 h-10 drop-shadow-md" />
        </button>
      </div>

      {/* Header UI */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 pointer-events-auto">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="text-green-500 w-6 h-6" />
            Pawsitive Community
          </h2>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Live Safety Updates</p>
        </div>

        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-xl transition-all active:scale-95 pointer-events-auto"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Left List View */}
      <div className="absolute top-32 left-6 w-85 max-h-[480px] overflow-y-auto space-y-3 pointer-events-auto pr-2">
        {mockAlerts.map(alert => (
          <div 
            key={alert.id}
            onClick={() => setSelectedAlert(alert)}
            className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className={`p-2.5 rounded-xl border ${getTypeStyles(alert.type)}`}>
                {getIcon(alert.type)}
              </span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">{alert.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    <span>{alert.time}</span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{alert.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Modal */}
      {selectedAlert && (
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTypeStyles(selectedAlert.type)}`}>
                  {selectedAlert.type === 'DANGER' ? 'ΚΙΝΔΥΝΟΣ' : 'ΕΚΔΗΛΩΣΗ'}
                </span>
                <button onClick={() => setSelectedAlert(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3 leading-tight">{selectedAlert.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">{selectedAlert.description}</p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Αξιοπιστία</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-blue-600">{selectedAlert.trustScore}%</span>
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="flex-1 pl-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Επιβεβαιώσεις</span>
                  <span className="text-lg font-bold text-slate-800">{selectedAlert.verifications}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition active:scale-95">
                  <ThumbsUp className="w-4 h-4" /> ΕΠΙΒΕΒΑΙΩΝΩ
                </button>
                <button className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition border border-slate-100">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
