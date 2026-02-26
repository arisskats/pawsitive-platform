"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, PawPrint, Sparkles, Weight } from "lucide-react";
import FoodScanner from "@/src/components/dashboard/FoodScanner";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

interface Pet {
  id: string;
  name: string;
  type: "DOG" | "CAT";
  breed?: string;
  birthday?: string;
  weight?: number;
}

export default function Dashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState<"DOG" | "CAT">("DOG");
  const [newPetBreed, setNewPetBreed] = useState("");
  const [newPetBirthday, setNewPetBirthday] = useState("");
  const [newPetWeight, setNewPetWeight] = useState("");
  const { lang } = useLanguage();

  const text = {
    el: {
      badge: "Πίνακας ευεξίας κατοικιδίων",
      title: "Pawsitive Tracker",
      welcome: "Καλώς ήρθες ξανά!",
      addPet: "+ Νέο Κατοικίδιο",
      pets: "Κατοικίδια",
      birthdays: "Γενέθλια καταγεγραμμένα",
      weightTracked: "Βάρος καταγεγραμμένο",
      aiTools: "AI εργαλεία ενεργά",
      loadingPets: "Φόρτωση κατοικιδίων...",
      noPetsTitle: "Δεν βρέθηκαν κατοικίδια ακόμα.",
      noPetsText: "Πρόσθεσε το πρώτο σου κατοικίδιο για να ενεργοποιήσεις insights και AI εργαλεία.",
      unknownBreed: "Άγνωστη ράτσα",
      type: "Είδος",
      birthday: "Γενέθλια",
      weight: "Βάρος",
      healthStats: "Στατιστικά Υγείας",
      healthStatsText: "Κράτα τα κατοικίδιά σου ενεργά και τα checkups στην ώρα τους.",
      aiSection: "Έξυπνα Εργαλεία AI",
      symptomChecker: "Έλεγχος Συμπτωμάτων",
      reportSummarizer: "Σύνοψη Αναφορών",
      addNewPet: "Προσθήκη Νέου Κατοικιδίου",
      close: "Κλείσιμο",
      name: "Όνομα",
      petType: "Τύπος",
      breed: "Ράτσα",
      weightKg: "Βάρος (kg)",
      cancel: "Ακύρωση",
      saving: "Αποθήκευση...",
      savePet: "Αποθήκευση",
    },
    en: {
      badge: "Pet wellness dashboard",
      title: "Pawsitive Tracker",
      welcome: "Welcome back!",
      addPet: "+ New Pet",
      pets: "Pets",
      birthdays: "Birthdays tracked",
      weightTracked: "Weight tracked",
      aiTools: "AI tools enabled",
      loadingPets: "Loading pets...",
      noPetsTitle: "No pets found yet.",
      noPetsText: "Add your first pet to unlock health insights and AI tools.",
      unknownBreed: "Unknown breed",
      type: "Type",
      birthday: "Birthday",
      weight: "Weight",
      healthStats: "Health Stats",
      healthStatsText: "Keep your pets active and their checkups up to date.",
      aiSection: "Smart AI Tools",
      symptomChecker: "Symptom Checker",
      reportSummarizer: "Report Summarizer",
      addNewPet: "Add New Pet",
      close: "Close",
      name: "Name",
      petType: "Type",
      breed: "Breed",
      weightKg: "Weight (kg)",
      cancel: "Cancel",
      saving: "Saving...",
      savePet: "Save Pet",
    },
  } as const;

  const t = text[lang];

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/pets");

      if (!response.ok) {
        throw new Error("Failed to fetch pets");
      }

      const data: Pet[] = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const stats = useMemo(() => {
    const withBirthday = pets.filter((pet) => Boolean(pet.birthday)).length;
    const withWeight = pets.filter((pet) => pet.weight !== undefined).length;
    return {
      total: pets.length,
      withBirthday,
      withWeight,
      aiTools: 2,
    };
  }, [pets]);

  const closeAddPetModal = () => {
    setIsAddPetModalOpen(false);
    setNewPetName("");
    setNewPetType("DOG");
    setNewPetBreed("");
    setNewPetBirthday("");
    setNewPetWeight("");
  };

  const handleAddPet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:3001/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: "cmlwsxc4o0000vlwc0ermhwj0",
          name: newPetName.trim(),
          type: newPetType,
          breed: newPetBreed.trim() || undefined,
          birthday: newPetBirthday || undefined,
          weight: newPetWeight ? Number(newPetWeight) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create pet");
      }
      closeAddPetModal();
      await fetchPets();
    } catch (error) {
      console.error("Error creating pet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sky-100/90 bg-white/78 p-6 shadow-[0_8px_22px_rgba(46,92,155,0.08)] backdrop-blur">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1 text-xs font-semibold text-sky-700">{t.badge}</p>
            <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-slate-600">{t.welcome}</p>
          </div>
          <button
            onClick={() => setIsAddPetModalOpen(true)}
            className="rounded-xl border border-sky-300 bg-gradient-to-r from-[#7ee5d7] to-[#8fdcff] px-5 py-2.5 font-semibold text-slate-900 shadow-[0_10px_20px_rgba(100,208,220,0.25)] transition hover:brightness-105"
          >
            {t.addPet}
          </button>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card-hover rounded-xl border border-sky-100/80 bg-white/90 p-4 shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
            <p className="text-xs text-slate-500">{t.pets}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <PawPrint className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="card-hover rounded-xl border border-sky-100/80 bg-white/90 p-4 shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
            <p className="text-xs text-slate-500">{t.birthdays}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{stats.withBirthday}</p>
              <CalendarClock className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="card-hover rounded-xl border border-sky-100/80 bg-white/90 p-4 shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
            <p className="text-xs text-slate-500">{t.weightTracked}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{stats.withWeight}</p>
              <Weight className="h-5 w-5 text-pink-600" />
            </div>
          </div>
          <div className="card-hover rounded-xl border border-sky-100/80 bg-white/90 p-4 shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
            <p className="text-xs text-slate-500">{t.aiTools}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{stats.aiTools}</p>
              <Sparkles className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {loading ? (
            <div className="rounded-2xl border border-sky-100/80 bg-white/90 p-6 shadow-[0_8px_22px_rgba(46,92,155,0.08)]">
              <p className="text-slate-600">{t.loadingPets}</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sky-200 bg-white/90 p-6 shadow-[0_8px_22px_rgba(46,92,155,0.08)]">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-pink-100 text-2xl">
                🐾
              </div>
              <p className="text-slate-700">{t.noPetsTitle}</p>
              <p className="mt-2 text-sm text-slate-500">{t.noPetsText}</p>
            </div>
          ) : (
            pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/dashboard/pet/${pet.id}`}
                className="card-hover cursor-pointer rounded-2xl border border-sky-100/80 bg-white/90 p-6 shadow-[0_8px_22px_rgba(46,92,155,0.08)]"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-pink-100 text-2xl">
                    {pet.type === "DOG" ? "🐶" : "🐱"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{pet.name}</h2>
                    <p className="text-sm text-gray-500">{pet.breed ?? t.unknownBreed}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t.type}:</span>
                    <span className="font-medium text-gray-700">{pet.type}</span>
                  </div>
                  {pet.birthday && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t.birthday}:</span>
                      <span className="font-medium text-gray-700">{new Date(pet.birthday).toLocaleDateString(lang === "el" ? "el-GR" : "en-US")}</span>
                    </div>
                  )}
                  {pet.weight !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t.weight}:</span>
                      <span className="font-medium text-gray-700">{pet.weight} kg</span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}

          <div className="flex flex-col justify-center rounded-2xl border border-sky-100 bg-gradient-to-br from-cyan-50 to-emerald-50 p-6 text-center shadow-[0_8px_22px_rgba(46,92,155,0.08)]">
            <h3 className="mb-2 font-bold text-blue-900">{t.healthStats}</h3>
            <p className="text-sm text-blue-700">{t.healthStatsText}</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">{t.aiSection}</h2>
          <div className="grid grid-cols-1 gap-8">
            {pets.length > 0 && <FoodScanner petId={pets[0].id} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="card-hover cursor-pointer rounded-xl border border-sky-100/80 bg-white/90 p-5 text-center shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
                <div className="mb-2 text-2xl">🩺</div>
                <span className="text-sm font-medium">{t.symptomChecker}</span>
              </div>
              <div className="card-hover cursor-pointer rounded-xl border border-sky-100/80 bg-white/90 p-5 text-center shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
                <div className="mb-2 text-2xl">📄</div>
                <span className="text-sm font-medium">{t.reportSummarizer}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-[0_18px_40px_rgba(46,92,155,0.18)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t.addNewPet}</h2>
              <button onClick={closeAddPetModal} className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                {t.close}
              </button>
            </div>

            <form onSubmit={handleAddPet} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  {t.name}
                </label>
                <input
                  id="name"
                  type="text"
                  value={newPetName}
                  onChange={(event) => setNewPetName(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
                  {t.petType}
                </label>
                <select
                  id="type"
                  value={newPetType}
                  onChange={(event) => setNewPetType(event.target.value as "DOG" | "CAT")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="DOG">DOG</option>
                  <option value="CAT">CAT</option>
                </select>
              </div>

              <div>
                <label htmlFor="breed" className="mb-1 block text-sm font-medium text-gray-700">
                  {t.breed}
                </label>
                <input
                  id="breed"
                  type="text"
                  value={newPetBreed}
                  onChange={(event) => setNewPetBreed(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="birthday" className="mb-1 block text-sm font-medium text-gray-700">
                  {t.birthday}
                </label>
                <input
                  id="birthday"
                  type="date"
                  value={newPetBirthday}
                  onChange={(event) => setNewPetBirthday(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="weight" className="mb-1 block text-sm font-medium text-gray-700">
                  {t.weightKg}
                </label>
                <input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={newPetWeight}
                  onChange={(event) => setNewPetWeight(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeAddPetModal} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? t.saving : t.savePet}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
