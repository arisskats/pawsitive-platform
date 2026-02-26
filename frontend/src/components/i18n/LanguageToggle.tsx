"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex rounded-lg border border-sky-200 bg-white/80 p-1 text-xs font-semibold">
      <button
        className={`rounded-md px-2 py-1 transition ${lang === "el" ? "bg-sky-100 text-sky-900" : "text-slate-600 hover:text-slate-900"}`}
        onClick={() => setLang("el")}
      >
        EL
      </button>
      <button
        className={`rounded-md px-2 py-1 transition ${lang === "en" ? "bg-sky-100 text-sky-900" : "text-slate-600 hover:text-slate-900"}`}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
