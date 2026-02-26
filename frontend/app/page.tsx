"use client";

import Link from "next/link";
import { HeartPulse, MapPinned, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function Home() {
  const { lang } = useLanguage();

  const copy = {
    el: {
      badge: "Pawsitive Platform",
      title: "Ένα πιο ήρεμο, έξυπνο σπίτι για την υγεία και την καθημερινή χαρά του κατοικιδίου σου.",
      subtitle:
        "Παρακολούθησε ρουτίνες, ευεξία και pet-friendly σημεία.",
      subline: "Ένα κομψό dashboard για οικογένειες που νοιάζονται.",
      b1: "Ιστορικό υγείας σε ένα σημείο",
      b2: "Community alerts με σαφήνεια",
      b3: "AI βοήθεια χωρίς πολυπλοκότητα",
      ctaDashboard: "Άνοιγμα Dashboard",
      ctaMap: "Εξερεύνηση Community Χάρτη",
      statusTitle: "Κατάσταση φροντίδας",
      statusToday: "Σήμερα με μια ματιά",
      routines: "Ρουτίνες υγείας",
      routinesValue: "Σε καλό δρόμο",
      alerts: "Community ειδοποιήσεις",
      alertsValue: "2 ενεργές",
      aiChecks: "AI έλεγχοι",
      aiChecksValue: "Έτοιμο",
      card1Title: "Παρακολούθηση Υγείας",
      card1Text: "Κράτα οργανωμένο ιστορικό και δες γρήγορα ό,τι έχει σημασία.",
      card2Title: "Σημεία Κοινότητας",
      card2Text: "Ανακάλυψε αξιόπιστα μέρη και σημειώσεις από την τοπική κοινότητα.",
      card3Title: "AI Βοήθεια Φροντίδας",
      card3Text: "Χρησιμοποίησε έξυπνα εργαλεία για τροφή και γρήγορη καθοδήγηση.",
    },
    en: {
      badge: "Pawsitive Platform",
      title: "A calmer, smarter home for your pet's health and daily joy.",
      subtitle: "Track routines, monitor wellness, and discover pet-friendly spots.",
      subline: "A refined dashboard built for care-first families.",
      b1: "Health history in one place",
      b2: "Clear community alerts",
      b3: "AI help without complexity",
      ctaDashboard: "Open Dashboard",
      ctaMap: "Explore Community Map",
      statusTitle: "Pet care status",
      statusToday: "Today at a glance",
      routines: "Health routines",
      routinesValue: "On track",
      alerts: "Community alerts",
      alertsValue: "2 active",
      aiChecks: "AI checks",
      aiChecksValue: "Ready",
      card1Title: "Health-first Tracking",
      card1Text: "Keep records organized and always know what matters most for your pet.",
      card2Title: "Community Spots",
      card2Text: "Discover trusted places and shared notes from your local pet community.",
      card3Title: "AI-Assisted Care",
      card3Text: "Use smart tools for food checks and quick guidance in your daily routine.",
    },
  } as const;

  const t = copy[lang];

  return (
    <main className="min-h-screen text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-28 top-[-120px] h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="pointer-events-none absolute right-[-80px] top-16 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />

        <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-14 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-sky-700 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              {t.badge}
            </p>

            <h1 className="max-w-[16ch] text-4xl leading-[1.01] text-slate-900 sm:text-5xl">{t.title}</h1>

            <p className="mt-5 max-w-xl text-base text-slate-700 sm:text-lg">{t.subtitle}</p>
            <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">{t.subline}</p>

            <ul className="mt-5 grid max-w-xl gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <li className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/55 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span>{t.b1}</span>
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/55 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{t.b2}</span>
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/55 px-3 py-2 sm:col-span-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                <span>{t.b3}</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl border border-sky-300 bg-gradient-to-r from-[#7ee5d7] to-[#8fdcff] px-5 py-3 font-semibold text-slate-900 shadow-[0_10px_22px_rgba(100,208,220,0.26)] transition hover:brightness-105"
              >
                {t.ctaDashboard}
              </Link>
              <Link
                href="/dashboard/map"
                className="rounded-xl border border-slate-200 bg-white/80 px-5 py-3 font-semibold text-slate-800 transition hover:bg-white"
              >
                {t.ctaMap}
              </Link>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-700">{t.statusTitle}</p>
            <h2 className="mt-2 text-3xl text-slate-900">{t.statusToday}</h2>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/75 p-3">
                <span className="text-sm text-slate-700">{t.routines}</span>
                <span className="text-sm font-semibold text-sky-700">{t.routinesValue}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/75 p-3">
                <span className="text-sm text-slate-700">{t.alerts}</span>
                <span className="text-sm font-semibold text-amber-600">{t.alertsValue}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/75 p-3">
                <span className="text-sm text-slate-700">{t.aiChecks}</span>
                <span className="text-sm font-semibold text-violet-700">{t.aiChecksValue}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-3">
          <article className="card-hover rounded-2xl border border-slate-200/90 bg-white/90 p-5 backdrop-blur shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
            <HeartPulse className="mb-3 h-5 w-5 text-pink-500" />
            <h2 className="text-lg text-slate-900">{t.card1Title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.card1Text}</p>
          </article>

          <article className="card-hover rounded-2xl border border-slate-200/90 bg-white/90 p-5 backdrop-blur shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
            <MapPinned className="mb-3 h-5 w-5 text-cyan-600" />
            <h2 className="text-lg text-slate-900">{t.card2Title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.card2Text}</p>
          </article>

          <article className="card-hover rounded-2xl border border-slate-200/90 bg-white/90 p-5 backdrop-blur shadow-[0_6px_16px_rgba(56,88,128,0.06)]">
            <ShieldCheck className="mb-3 h-5 w-5 text-violet-600" />
            <h2 className="text-lg text-slate-900">{t.card3Title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.card3Text}</p>
          </article>
        </section>
      </div>
    </main>
  );
}
