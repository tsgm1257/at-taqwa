"use client";

import { useLanguage } from "@/app/providers";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  return (
    <select
      className="select select-ghost select-xs text-xs min-h-0 h-8 w-16"
      aria-label="Language"
      value={locale}
      onChange={(e) => setLocale(e.target.value as "en" | "bn")}
    >
      <option value="en">EN</option>
      <option value="bn">বাংলা</option>
    </select>
  );
}
