"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/i18n";

// ---------- Language Context ----------
type LangCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LangCtx | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <Providers>");
  return ctx;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // initial from cookie (client-side)
  useEffect(() => {
    const cookieLang = document.cookie
      .split("; ")
      .find((c) => c.startsWith("lang="))
      ?.split("=")?.[1] as Locale | undefined;
    if (cookieLang === "bn" || cookieLang === "en") {
      setLocaleState(cookieLang);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    // non-HttpOnly cookie for server to read at SSR
    document.cookie = `lang=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    // update <html lang="..."> for a11y
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", l);
    }
  };

  const messages = useMemo(() => getMessages(locale), [locale]);
  const t = (key: string, vars?: Record<string, string | number>) => {
    const msg = messages[key] ?? key;
    if (!vars) return msg;
    return Object.keys(vars).reduce(
      (acc, k) => acc.replace(new RegExp(`{${k}}`, "g"), String(vars[k])),
      msg
    );
  };

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange={false}
        storageKey="at-taqwa-theme"
      >
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
          {children}
        </LanguageContext.Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}
