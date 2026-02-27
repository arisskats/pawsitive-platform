"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Compass, MapPinned, Plus, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

interface Spot {
  id: string;
  name?: string;
  address?: string;
  latitude: number;
  longitude: number;
}

interface CommunityAlert {
  id: string;
  type: "DANGER" | "EVENT" | "INFO";
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  severity: number;
  createdAt: string;
  author?: {
    name?: string;
    trustScore?: number;
  };
  _count?: {
    verifications?: number;
  };
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
  const [alerts, setAlerts] = useState<CommunityAlert[]>([]);
  const [loadingSpots, setLoadingSpots] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formType, setFormType] = useState<CommunityAlert["type"]>("INFO");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLatitude, setFormLatitude] = useState("37.9838");
  const [formLongitude, setFormLongitude] = useState("23.7278");
  const [formSeverity, setFormSeverity] = useState("2");
  const { lang } = useLanguage();

  const t = {
    el: {
      badge: "Community Map",
      title: "Χάρτης Κοινότητας",
      subtitle: "Σημεία πόλης + πραγματικές social ειδοποιήσεις από την κοινότητα.",
      spotsTitle: "Pet-friendly Σημεία",
      alertsTitle: "Community Alerts",
      loading: "Φόρτωση...",
      emptySpots: "Δεν βρέθηκαν σημεία.",
      emptyAlerts: "Δεν υπάρχουν alerts ακόμα.",
      fallbackAddress: "Αθήνα, Ελλάδα",
      points: "σημεία",
      alerts: "alerts",
      danger: "Κίνδυνος",
      event: "Εκδήλωση",
      info: "Πληροφορία",
      verifications: "επιβεβαιώσεις",
      severity: "severity",
      by: "από",
      anonymous: "ανώνυμος",
      communityLive: "Live community feed",
      newAlert: "Νέο Alert",
      createAlert: "Δημιουργία Alert",
      close: "Κλείσιμο",
      type: "Τύπος",
      titleField: "Τίτλος",
      description: "Περιγραφή",
      latitude: "Latitude",
      longitude: "Longitude",
      cancel: "Ακύρωση",
      submit: "Δημιουργία",
      submitting: "Αποθήκευση...",
      authHint: "Για submit απαιτείται login token στο localStorage (pawsitiveToken).",
      submitFailed: "Αποτυχία δημιουργίας alert. Έλεγξε auth token/API.",
      createFirstAlert: "Δημιούργησε το πρώτο alert",
      mapClickHint: "Tip: κάνε κλικ στον χάρτη για auto συμπλήρωση συντεταγμένων.",
    },
    en: {
      badge: "Community Map",
      title: "Community Map",
      subtitle: "City spots + real social safety updates from the community.",
      spotsTitle: "Pet-friendly Spots",
      alertsTitle: "Community Alerts",
      loading: "Loading...",
      emptySpots: "No spots found.",
      emptyAlerts: "No alerts yet.",
      fallbackAddress: "Athens, Greece",
      points: "spots",
      alerts: "alerts",
      danger: "Danger",
      event: "Event",
      info: "Info",
      verifications: "verifications",
      severity: "severity",
      by: "by",
      anonymous: "anonymous",
      communityLive: "Live community feed",
      newAlert: "New Alert",
      createAlert: "Create Alert",
      close: "Close",
      type: "Type",
      titleField: "Title",
      description: "Description",
      latitude: "Latitude",
      longitude: "Longitude",
      cancel: "Cancel",
      submit: "Create",
      submitting: "Saving...",
      authHint: "Submitting requires a login token in localStorage (pawsitiveToken).",
      submitFailed: "Failed to create alert. Check auth token/API.",
      createFirstAlert: "Create the first alert",
      mapClickHint: "Tip: click on the map to auto-fill coordinates.",
    },
  }[lang];

  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://localhost:3001/community/alerts");
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Fetch alerts error:", error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch("http://localhost:3001/spots");
        if (response.ok) {
          const data = await response.json();
          setSpots(data);
        }
      } catch (error) {
        console.error("Fetch spots error:", error);
      } finally {
        setLoadingSpots(false);
      }
    };

    fetchSpots();
    fetchAlerts();
  }, []);

  const resetForm = () => {
    setFormType("INFO");
    setFormTitle("");
    setFormDescription("");
    setFormLatitude("37.9838");
    setFormLongitude("23.7278");
    setFormSeverity("2");
    setSubmitError(null);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormLatitude(lat.toFixed(6));
    setFormLongitude(lng.toFixed(6));
    setIsCreateOpen(true);
  };

  const handleCreateAlert = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      setIsSubmitting(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("pawsitiveToken") : null;

      const response = await fetch("http://localhost:3001/community/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          type: formType,
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          latitude: Number(formLatitude),
          longitude: Number(formLongitude),
          severity: Number(formSeverity),
        }),
      });

      if (!response.ok) {
        throw new Error("Create failed");
      }

      await fetchAlerts();
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      console.error("Create alert error:", error);
      setSubmitError(t.submitFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapPoints = useMemo(() => {
    const spotPoints: Spot[] = spots.map((spot) => ({
      id: `spot-${spot.id}`,
      name: spot.name,
      address: spot.address,
      latitude: spot.latitude,
      longitude: spot.longitude,
    }));

    const alertPoints: Spot[] = alerts.map((alert) => ({
      id: `alert-${alert.id}`,
      name: `⚠️ ${alert.title}`,
      address: `${alert.type} • ${t.severity} ${alert.severity}`,
      latitude: alert.latitude,
      longitude: alert.longitude,
    }));

    return [...spotPoints, ...alertPoints];
  }, [spots, alerts, t.severity]);

  const alertTypeLabel = (type: CommunityAlert["type"]) => {
    if (type === "DANGER") return t.danger;
    if (type === "EVENT") return t.event;
    return t.info;
  };

  const alertTypeClasses = (type: CommunityAlert["type"]) => {
    if (type === "DANGER") return "border-rose-200 bg-rose-50 text-rose-700";
    if (type === "EVENT") return "border-sky-200 bg-sky-50 text-sky-700";
    return "border-slate-200 bg-slate-50 text-slate-700";
  };

  return (
    <div className="min-h-screen p-8 text-gray-900">
      <header className="mb-8 rounded-2xl border border-sky-100/90 bg-white/80 p-6 shadow-[0_8px_22px_rgba(46,92,155,0.08)] backdrop-blur">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-sky-700 uppercase">
          <Sparkles className="h-3.5 w-3.5" /> {t.badge}
        </p>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
              <MapPinned className="h-6 w-6 text-sky-600" /> {t.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{t.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-gradient-to-r from-[#7ee5d7] to-[#8fdcff] px-3 py-2 text-sm font-semibold text-slate-900 shadow-[0_10px_20px_rgba(100,208,220,0.25)] transition hover:brightness-105"
            >
              <Plus className="h-4 w-4" /> {t.newAlert}
            </button>
            <div className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm">
              <Compass className="h-4 w-4 text-sky-600" />
              <span className="font-semibold">{spots.length}</span>
              <span>{t.points}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm">
              <Users className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold">{alerts.length}</span>
              <span>{t.alerts}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
        <div className="space-y-5 rounded-2xl border border-sky-100/90 bg-white/70 p-4 shadow-[0_8px_22px_rgba(46,92,155,0.06)]">
          <section>
            <h2 className="mb-3 font-semibold text-gray-700">{t.spotsTitle}</h2>
            <div className="custom-scrollbar flex max-h-[190px] flex-col gap-2 overflow-y-auto pr-1">
              {loadingSpots ? (
                <p className="text-sm text-slate-400">{t.loading}</p>
              ) : spots.length === 0 ? (
                <p className="text-sm italic text-slate-400">{t.emptySpots}</p>
              ) : (
                spots.map((spot) => (
                  <div key={spot.id} className="rounded-lg border border-sky-100/80 bg-white/92 p-3">
                    <h3 className="text-sm font-semibold text-gray-800">{spot.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{spot.address || t.fallbackAddress}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 inline-flex items-center gap-2 font-semibold text-gray-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> {t.alertsTitle}
            </h2>
            <p className="mb-2 text-xs text-slate-500">{t.communityLive}</p>
            <div className="custom-scrollbar flex max-h-[320px] flex-col gap-2 overflow-y-auto pr-1">
              {loadingAlerts ? (
                <p className="text-sm text-slate-400">{t.loading}</p>
              ) : alerts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-sky-200 bg-sky-50/40 p-3">
                  <p className="text-sm italic text-slate-500">{t.emptyAlerts}</p>
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="mt-2 inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> {t.createFirstAlert}
                  </button>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-slate-100 bg-white/92 p-3 shadow-[0_6px_16px_rgba(56,88,128,0.05)]">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${alertTypeClasses(alert.type)}`}>
                        {alert.type === "DANGER" && <AlertTriangle className="h-3.5 w-3.5" />}
                        {alertTypeLabel(alert.type)}
                      </span>
                      <span className="text-[11px] text-slate-500">{t.severity} {alert.severity}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-800">{alert.title}</h3>
                    {alert.description && <p className="mt-1 line-clamp-2 text-xs text-slate-600">{alert.description}</p>}

                    <div className="mt-2 text-[11px] text-slate-500">
                      {t.by} {alert.author?.name || t.anonymous} • {alert._count?.verifications ?? 0} {t.verifications}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="h-full min-h-[600px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-[0_12px_28px_rgba(56,88,128,0.14)]">
          <LeafletMap spots={mapPoints} onMapClick={handleMapClick} />
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/25 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-[0_18px_40px_rgba(46,92,155,0.18)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{t.createAlert}</h2>
              <button onClick={() => { setIsCreateOpen(false); resetForm(); }} className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t.type}</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value as CommunityAlert["type"])} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100">
                    <option value="INFO">INFO</option>
                    <option value="EVENT">EVENT</option>
                    <option value="DANGER">DANGER</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t.severity}</label>
                  <input type="number" min={1} max={5} value={formSeverity} onChange={(e) => setFormSeverity(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t.titleField}</label>
                <input required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t.description}</label>
                <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t.latitude}</label>
                  <input required type="number" step="0.000001" value={formLatitude} onChange={(e) => setFormLatitude(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t.longitude}</label>
                  <input required type="number" step="0.000001" value={formLongitude} onChange={(e) => setFormLongitude(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
                </div>
              </div>

              <p className="text-xs text-slate-500">{t.mapClickHint}</p>
              <p className="text-xs text-slate-500">{t.authHint}</p>
              {submitError && <p className="text-sm text-rose-600">{submitError}</p>}

              <div className="sticky bottom-0 -mx-6 mt-1 flex justify-end gap-3 border-t border-sky-100/80 bg-white/95 px-6 pb-1 pt-4">
                <button type="button" onClick={() => { setIsCreateOpen(false); resetForm(); }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {t.cancel}
                </button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg border border-sky-300 bg-gradient-to-r from-[#7ee5d7] to-[#8fdcff] px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60">
                  {isSubmitting ? t.submitting : t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
