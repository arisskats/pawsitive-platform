"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, HeartPulse, PawPrint, Scale } from "lucide-react";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

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
  const { lang } = useLanguage();

  const t = {
    el: {
      loading: "Φορτώνω το προφίλ... 🐾",
      notFound: "Το κατοικίδιο δεν βρέθηκε. 🚫",
      back: "Πίσω στο Dashboard",
      unknownBreed: "Άγνωστη ράτσα",
      basics: "Βασικά Στοιχεία",
      type: "Είδος",
      weight: "Βάρος",
      birthday: "Γενέθλια",
      healthHistory: "Ιστορικό Υγείας",
      noHealth: "Δεν υπάρχουν ακόμα εγγραφές υγείας.",
      aiFood: "Αναλύσεις Τροφών AI",
      noFood: "Δεν έχετε κάνει ακόμα σκανάρισμα τροφής.",
      healthRecords: "Εγγραφές υγείας",
      foodScans: "Food scans",
      profile: "Προφίλ κατοικιδίου",
    },
    en: {
      loading: "Loading profile... 🐾",
      notFound: "Pet not found. 🚫",
      back: "Back to Dashboard",
      unknownBreed: "Unknown breed",
      basics: "Basic Info",
      type: "Type",
      weight: "Weight",
      birthday: "Birthday",
      healthHistory: "Health History",
      noHealth: "No health records yet.",
      aiFood: "AI Food Analyses",
      noFood: "No food scans yet.",
      healthRecords: "Health records",
      foodScans: "Food scans",
      profile: "Pet profile",
    },
  }[lang];

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

  if (loading) return <div className="p-8 text-center text-gray-600">{t.loading}</div>;
  if (!pet) return <div className="p-8 text-center text-red-600">{t.notFound}</div>;

  const emoji = pet.type === "DOG" ? "🐶" : "🐱";

  return (
    <div className="min-h-screen p-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-sky-100 bg-white/80 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Link>

        <div className="overflow-hidden rounded-3xl border border-sky-100/90 bg-white/85 shadow-[0_12px_32px_rgba(46,92,155,0.12)] backdrop-blur">
          <div className="border-b border-sky-100/80 bg-gradient-to-r from-sky-100/90 via-cyan-50 to-emerald-50 p-8">
            <p className="mb-2 inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
              {t.profile}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-white/80 text-4xl shadow-sm">
                {emoji}
              </div>

              <div>
                <h1 className="text-4xl font-bold text-slate-900">{pet.name}</h1>
                <p className="text-base text-slate-600">{pet.breed ?? t.unknownBreed}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-4 rounded-2xl border border-sky-100/80 bg-white/80 p-5 shadow-[0_8px_18px_rgba(46,92,155,0.08)]">
              <h3 className="text-lg font-bold text-slate-900">{t.basics}</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white/80 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <PawPrint className="h-4 w-4" /> {t.type}
                  </span>
                  <span className="font-semibold text-slate-800">{pet.type}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white/80 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <Scale className="h-4 w-4" /> {t.weight}
                  </span>
                  <span className="font-semibold text-slate-800">{pet.weight ? `${pet.weight} kg` : "-"}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white/80 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <CalendarDays className="h-4 w-4" /> {t.birthday}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {pet.birthday ? new Date(pet.birthday).toLocaleDateString(lang === "el" ? "el-GR" : "en-US") : "-"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3 text-center">
                  <p className="text-lg font-bold text-sky-800">{pet.healthRecords.length}</p>
                  <p className="text-xs text-sky-700">{t.healthRecords}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-800">{pet.foodAnalyses.length}</p>
                  <p className="text-xs text-emerald-700">{t.foodScans}</p>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="rounded-2xl border border-sky-100/80 bg-white/90 p-5 shadow-[0_8px_18px_rgba(46,92,155,0.08)]">
                <h3 className="mb-3 inline-flex items-center gap-2 text-lg font-bold text-sky-800">
                  <HeartPulse className="h-5 w-5" /> {t.healthHistory}
                </h3>

                {pet.healthRecords.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-3 py-3 text-sm italic text-slate-500">{t.noHealth}</p>
                ) : (
                  <ul className="space-y-2">
                    {pet.healthRecords.map((record) => (
                      <li key={record.id} className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700">
                        {record.createdAt ? new Date(record.createdAt).toLocaleString(lang === "el" ? "el-GR" : "en-US") : record.id}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-2xl border border-violet-100/80 bg-white/90 p-5 shadow-[0_8px_18px_rgba(46,92,155,0.08)]">
                <h3 className="mb-3 text-lg font-bold text-violet-800">{t.aiFood}</h3>

                {pet.foodAnalyses.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-3 py-3 text-sm italic text-slate-500">{t.noFood}</p>
                ) : (
                  <ul className="space-y-2">
                    {pet.foodAnalyses.map((analysis) => (
                      <li key={analysis.id} className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700">
                        {analysis.createdAt ? new Date(analysis.createdAt).toLocaleString(lang === "el" ? "el-GR" : "en-US") : analysis.id}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
