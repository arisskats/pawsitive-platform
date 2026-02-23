"use client";

import React, { useState, useRef } from "react";
import { Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface FoodScannerProps {
  petId: string;
}

interface AnalysisResult {
  ingredients: string[];
  harmfulAdditives: string[];
  healthRating: number;
  summary: string;
  confidenceScore: number;
  toxicAlert: boolean;
}

export default function FoodScanner({ petId }: FoodScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsScanning(true);
      setError(null);
      setResult(null);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`http://localhost:3001/food-analysis/${petId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Η ανάλυση απέτυχε. Παρακαλώ δοκιμάστε ξανά.");
      }

      const data = await response.json();
      setResult(data.result); 
    } catch (err: any) {
      console.error("Scanning error:", err);
      setError(err.message || "Κάτι πήγε στραβά.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          AI Food Scanner
        </h3>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition disabled:opacity-50"
        >
          {isScanning ? "Scanning..." : "Ανέβασμα Φωτογραφίας"}
        </button>
      </div>

      {isScanning && (
        <div className="flex flex-col items-center justify-center py-8 bg-blue-50/50 rounded-lg animate-pulse">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-sm text-blue-700 font-medium">Η Μίνα αναλύει τα συστατικά...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
          {result.toxicAlert && (
            <div className="p-4 bg-red-600 text-white rounded-lg flex items-center gap-3 animate-bounce">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div className="text-sm font-bold">
                ΚΡΙΣΙΜΗ ΠΡΟΕΙΔΟΠΟΙΗΣΗ: Εντοπίστηκαν τοξικά συστατικά! Μην χρησιμοποιήσετε αυτή την τροφή.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex flex-col items-center text-green-800">
                <span className="text-xs uppercase font-bold opacity-70">Health Rating</span>
                <span className="text-2xl font-black">{result.healthRating}/10</span>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex flex-col items-center text-blue-800">
                <span className="text-xs uppercase font-bold opacity-70">Confidence</span>
                <span className="text-2xl font-black">{result.confidenceScore}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed italic">
              "{result.summary}"
            </p>
          </div>

          {result.harmfulAdditives.length > 0 && (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h4 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-2">
                ⚠️ Πιθανά Επιβλαβή
              </h4>
              <ul className="text-sm text-orange-700 list-disc list-inside">
                {result.harmfulAdditives.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
            Analysis by Mina Protocol Architect • v1.5 Stable
          </p>
        </div>
      )}

      {!isScanning && !result && !error && (
        <p className="text-sm text-gray-500 text-center py-4 italic">
          Βγάλτε μια φωτογραφία την ετικέτα της τροφής για άμεση ανάλυση υγείας.
        </p>
      )}
    </div>
  );
}
