"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, LayoutDashboard, MapPinned } from "lucide-react";
import LanguageToggle from "@/src/components/i18n/LanguageToggle";
import { useLanguage } from "@/src/components/i18n/LanguageProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  const labels = {
    el: {
      title: "Platform",
      subtitle: "Φροντίδα, καταγραφή και προστασία για την οικογένεια του κατοικιδίου σου.",
      dashboard: "Dashboard",
      map: "Χάρτης",
    },
    en: {
      title: "Platform",
      subtitle: "Care, track and protect your pet family.",
      dashboard: "Dashboard",
      map: "Map",
    },
  } as const;

  const t = labels[lang];

  const navItems = [
    {
      label: t.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t.map,
      href: "/dashboard/map",
      icon: MapPinned,
    },
  ];

  return (
    <aside className="glass w-full border-b border-sky-100/80 md:min-h-screen md:w-[19rem] md:border-b-0 md:border-r md:border-sky-100/80">
      <div className="px-4 py-4 md:px-7 md:py-8">
        <div className="mb-4 flex justify-end">
          <LanguageToggle />
        </div>

        <div className="mb-6 hidden rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm md:block">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
            <HeartPulse className="h-3.5 w-3.5" />
            Pawsitive
          </p>
          <h1 className="mt-2 text-2xl leading-tight text-slate-900">{t.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{t.subtitle}</p>
        </div>

        <nav className="flex gap-2 md:flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition md:w-full ${
                  isActive
                    ? "border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 text-slate-900 shadow-sm"
                    : "border border-slate-200/80 bg-white/65 text-slate-700 hover:border-sky-200 hover:bg-white hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
