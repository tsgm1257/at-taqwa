"use client";

import { useLanguage } from "@/app/providers";

export default function Unauthorized() {
  const { t } = useLanguage();

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold">{t("unauthorized.title")}</h1>
      <p className="mt-2 text-base-content/70">{t("unauthorized.message")}</p>
    </div>
  );
}
