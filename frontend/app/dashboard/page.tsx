"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, PawPrint, Sparkles, Weight } from "lucide-react";
import FoodScanner from "@/src/components/dashboard/FoodScanner";

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
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Pet wellness dashboard</p>
            <h1 className="text-3xl font-bold text-slate-900">Pawsitive Tracker</h1>
            <p className="text-slate-600">Welcome back!</p>
          </div>
          <button
            onClick={() => setIsAddPetModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-medium text-white shadow transition hover:brightness-110"
          >
            + New Pet
          </button>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="card-hover rounded-xl border border-white/80 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Pets</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <PawPrint className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="card-hover rounded-xl border border-white/80 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Birthdays tracked</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{stats.withBirthday}</p>
              <CalendarClock className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="card-hover rounded-xl border border-white/80 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Weight tracked</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{stats.withWeight}</p>
              <Weight className="h-5 w-5 text-pink-600" />
            </div>
          </div>
          <div className="card-hover rounded-xl border border-white/80 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">AI tools enabled</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">{stats.aiTools}</p>
              <Sparkles className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="rounded-2xl border border-white/80 bg-white p-6 shadow-sm">
              <p className="text-slate-600">Loading pets...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-pink-100 text-2xl">
                🐾
              </div>
              <p className="text-slate-700">No pets found yet.</p>
              <p className="mt-2 text-sm text-slate-500">Add your first pet to unlock health insights and AI tools.</p>
            </div>
          ) : (
            pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/dashboard/pet/${pet.id}`}
                className="card-hover cursor-pointer rounded-2xl border border-white/80 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-pink-100 text-2xl">
                    {pet.type === "DOG" ? "🐶" : "🐱"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{pet.name}</h2>
                    <p className="text-sm text-gray-500">{pet.breed ?? "Unknown breed"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-700">{pet.type}</span>
                  </div>
                  {pet.birthday && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Birthday:</span>
                      <span className="font-medium text-gray-700">
                        {new Date(pet.birthday).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {pet.weight !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Weight:</span>
                      <span className="font-medium text-gray-700">{pet.weight} kg</span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}

          <div className="flex flex-col justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center shadow-sm">
            <h3 className="mb-2 font-bold text-blue-900">Health Stats</h3>
            <p className="text-sm text-blue-700">Keep your pets active and their checkups up to date.</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Έξυπνα Εργαλεία AI</h2>
          <div className="grid grid-cols-1 gap-8">
            {pets.length > 0 && <FoodScanner petId={pets[0].id} />}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-hover cursor-pointer rounded-xl border border-white/80 bg-white p-5 text-center shadow-sm">
                <div className="mb-2 text-2xl">🩺</div>
                <span className="text-sm font-medium">Symptom Checker</span>
              </div>
              <div className="card-hover cursor-pointer rounded-xl border border-white/80 bg-white p-5 text-center shadow-sm">
                <div className="mb-2 text-2xl">📄</div>
                <span className="text-sm font-medium">Report Summarizer</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Pet</h2>
              <button
                onClick={closeAddPetModal}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddPet} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  Name
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
                  Type
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
                  Breed
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
                  Birthday
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
                  Weight (kg)
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
                <button
                  type="button"
                  onClick={closeAddPetModal}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
