"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "el" | "en";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("el");

  useEffect(() => {
    const saved = localStorage.getItem("pawsitive-lang");
    if (saved === "el" || saved === "en") setLang(saved);
  }, []);

  const updateLang = (value: Language) => {
    setLang(value);
    localStorage.setItem("pawsitive-lang", value);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang: updateLang,
      toggleLang: () => updateLang(lang === "el" ? "en" : "el"),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
