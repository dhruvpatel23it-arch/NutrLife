"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "./en";
import { hi } from "./hi";

// Add other languages here as they are created
const dictionaries: Record<string, any> = {
  en,
  hi,
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    // Load saved language from localStorage on mount
    const savedLang = localStorage.getItem("nutrilife_language");
    if (savedLang && dictionaries[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (dictionaries[lang]) {
      setLanguageState(lang);
      localStorage.setItem("nutrilife_language", lang);
    } else {
      console.warn(`Language ${lang} not found, falling back to English`);
      setLanguageState("en");
      localStorage.setItem("nutrilife_language", "en");
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let val = dictionaries[language];
    for (const k of keys) {
      if (val === undefined) break;
      val = val[k];
    }
    // Fallback to English if translation is missing in the current language
    if (val === undefined && language !== "en") {
      val = dictionaries["en"];
      for (const k of keys) {
        if (val === undefined) break;
        val = val[k];
      }
    }
    return typeof val === "string" ? val : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
