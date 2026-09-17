"use client";
import {useEffect, useState} from "react";

export function useSiteLanguage() {
  const [lang, updateLanguage] = useState<"zh" | "en">("zh");
  useEffect(() => {
    const sync = () => {
      const query = new URLSearchParams(window.location.search).get("lang");
      const saved = localStorage.getItem("site-language");
      const next = query === "en" || query === "zh" ? query : saved === "en" ? "en" : "zh";
      updateLanguage(next);
      localStorage.setItem("site-language", next);
    };
    sync();
    window.addEventListener("site-language-change", sync);
    return () => window.removeEventListener("site-language-change", sync);
  }, []);
  const setLang = (next: "zh" | "en") => {
    updateLanguage(next);
    localStorage.setItem("site-language", next);
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", next);
      window.history.replaceState(null, "", url);
    }
    window.dispatchEvent(new Event("site-language-change"));
  };
  return {lang, en: lang === "en", setLang};
}
