"use client";
import React from "react";
import Link from "next/link";
import Section from "./Section";
import { Search, Sun, Moon, Globe2, LogIn, LogOut } from "lucide-react";
import { useLanguage } from "@/app/providers";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { data: session, status } = useSession();

  // simple theme toggle hook-in (optional; wire to your theme system)
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  return (
    <>
      {/* Main Navbar */}
      <header className="sticky top-0 z-40 border-b border-emerald-200/60 dark:border-emerald-800/60 bg-white/80 dark:bg-emerald-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <Section
          id="main-navbar"
          className="flex items-center justify-between py-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500 text-white grid place-items-center font-black">
              AT
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide">
                {t("app.title")}
              </div>
              <div className="text-[11px] text-emerald-700/70 dark:text-emerald-200/70">
                {t("hero.subtitle")}
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="hover:text-emerald-600 dark:hover:text-emerald-300 transition"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/projects"
              className="hover:text-emerald-600 dark:hover:text-emerald-300 transition"
            >
              {t("nav.projects")}
            </Link>
            <Link
              href="/donate"
              className="hover:text-emerald-600 dark:hover:text-emerald-300 transition"
            >
              {t("common.donate")}
            </Link>
            <Link
              href="/announcements"
              className="hover:text-emerald-600 dark:hover:text-emerald-300 transition"
            >
              {t("nav.announcements")}
            </Link>
            <Link
              href="/reports"
              className="hover:text-emerald-600 dark:hover:text-emerald-300 transition"
            >
              {t("nav.reports")}
            </Link>
            <Link
              href="/events"
              className="hover:text-emerald-600 dark:hover:text-emerald-300 transition"
            >
              {t("nav.events")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 px-2.5 py-1.5 text-sm bg-white/70 dark:bg-emerald-900/30">
              <Search className="h-4 w-4 opacity-70" />
              <input
                placeholder="Search projects, events, reports"
                className="bg-transparent outline-none w-56"
              />
            </div>

            {/* Language, Theme, and Auth Controls */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-50/60 dark:bg-emerald-900/30 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-200 hover:bg-emerald-100/70 dark:hover:bg-emerald-800/40 transition"
                onClick={() => setLocale(locale === "en" ? "bn" : "en")}
                aria-label="Toggle language"
                title="Toggle Language"
              >
                <Globe2 className="h-4 w-4" />
                {locale === "en" ? "বাংলা" : "English"}
              </button>

              {/* Theme Toggle */}
              <button
                aria-label="Toggle Theme"
                className="rounded-full p-2 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/30 transition"
                onClick={() => setIsDark((v) => !v)}
              >
                <Sun className="h-4 w-4 hidden dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
              </button>

              {/* Auth Button */}
              {status === "loading" ? (
                <div className="w-8 h-8 animate-pulse bg-emerald-200 dark:bg-emerald-800 rounded-full"></div>
              ) : session ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={session.user?.role === "Admin" ? "/admin" : "/member"}
                    className="text-sm text-emerald-700 dark:text-emerald-200 hover:text-emerald-600 dark:hover:text-emerald-300 transition font-medium hidden sm:inline"
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <button
                    aria-label="Sign Out"
                    className="rounded-full p-2 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/30 transition"
                    onClick={() => signOut()}
                    title={t("nav.signOut")}
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  aria-label="Sign In"
                  className="rounded-full p-2 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/30 transition"
                  onClick={() => signIn()}
                  title={t("nav.signIn")}
                >
                  <LogIn className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </Section>
      </header>
    </>
  );
}
