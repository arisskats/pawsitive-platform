"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";

interface HealthRecord {
  id: string;
  createdAt?: string;
}

interface FoodAnalysis {
  id: string;
  createdAt?: string;
}

interface Pet {
  id: string;
  name: string;
  type: "DOG" | "CAT";
  breed?: string;
  birthday?: string;
  weight?: number;
  healthRecords: HealthRecord[];
  foodAnalyses: FoodAnalysis[];
}

export default function PetProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`http://localhost:3001/pets/${id}`);
        if (!response.ok) throw new Error("Pet not found");
        const data = await response.json();
        setPet(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-600">Φορτώνω το προφίλ... 🐾</div>;
  if (!pet) return <div className="p-8 text-center text-red-600">Το κατοικίδιο δεν βρέθηκε. 🚫</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Πίσω στο Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 p-8 text-white flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              {pet.type === "DOG" ? "🐶" : "🐱"}
            </div>
            <div>
              <h1 className="text-4xl font-bold">{pet.name}</h1>
              <p className="opacity-90 text-lg">{pet.breed ?? "Άγνωστη ράτσα"}</p>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stats Column */}
            <div className="space-y-6">
              <h3 className="text-gray-900 font-bold border-b pb-2 text-lg">Βασικά Στοιχεία</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Είδος:</span>
                  <span className="font-medium">{pet.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Βάρος:</span>
                  <span className="font-medium">{pet.weight ? `${pet.weight} kg` : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Γενέθλια:</span>
                  <span className="font-medium">
                    {pet.birthday ? new Date(pet.birthday).toLocaleDateString("el-GR") : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Health & History Column */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-gray-900 font-bold border-b pb-2 text-lg mb-4 text-blue-700">
                  Ιστορικό Υγείας 🩺
                </h3>
                {pet.healthRecords.length === 0 ? (
                  <p className="text-gray-500 italic">Δεν υπάρχουν ακόμα εγγραφές υγείας.</p>
                ) : (
                  <ul className="space-y-3">
                    {/* Maps records here */}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="text-gray-900 font-bold border-b pb-2 text-lg mb-4 text-purple-700">
                  Αναλύσεις Τροφών AI 📸
                </h3>
                {pet.foodAnalyses.length === 0 ? (
                  <p className="text-gray-500 italic">Δεν έχετε κάνει ακόμα σκανάρισμα τροφής.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Maps analyses here */}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
