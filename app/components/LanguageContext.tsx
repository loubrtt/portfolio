"use client";

import { createContext, useContext } from "react";

export type Lang = "fr" | "en";

export const LanguageContext = createContext<Lang>("fr");

export function useLang() {
  return useContext(LanguageContext);
}

export function t(fr: string, en: string, lang: Lang) {
  return lang === "fr" ? fr : en;
}
