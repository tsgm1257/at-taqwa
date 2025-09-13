import en from "@/i18n/en.json";
import bn from "@/i18n/bn.json";

export type Locale = "en" | "bn";
export const SUPPORTED_LOCALES: Locale[] = ["en", "bn"];

const dict: Record<Locale, Record<string, string>> = { en, bn };

export function getMessages(locale: Locale) {
  return dict[locale] || dict.en;
}

export function translate(
  key: string,
  locale: Locale = "en",
  vars?: Record<string, string | number>
) {
  const msg = getMessages(locale)[key] ?? key;
  if (!vars) return msg;
  return Object.keys(vars).reduce(
    (acc, k) => acc.replace(new RegExp(`{${k}}`, "g"), String(vars[k])),
    msg
  );
}
