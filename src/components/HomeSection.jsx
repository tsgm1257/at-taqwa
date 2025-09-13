"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  HandCoins,
  Receipt,
  ShieldCheck,
} from "lucide-react";

import Section from "./Section";
import GeometricBg from "./GeometricBg";
import AnnouncementMarquee from "./AnnouncementMarquee";
import StatsGrid from "./StatsGrid";
import QuickDonate from "./QuickDonate";
import ProgressBar from "./ProgressBar";
import { useLanguage } from "./LanguageProvider";

const projects = [
  {
    id: 1,
    title: "Flood Relief 2025",
    raised: 6200,
    goal: 10000,
    excerpt: "Emergency support for families affected by seasonal floods.",
    tag: "Emergency",
  },
  {
    id: 2,
    title: "Winter Warmth Drive",
    raised: 3850,
    goal: 6000,
    excerpt: "Blankets & clothing for the needy before winter.",
    tag: "Seasonal",
  },
  {
    id: 3,
    title: "Tree Plantation Week",
    raised: 1250,
    goal: 3000,
    excerpt: "Plant 1,000+ trees across the union.",
    tag: "Environment",
  },
];

const stats = [
  { label: "Active Members", value: 128 },
  { label: "Donors This Month", value: 56 },
  { label: "Funds Raised (BDT)", value: 280450 },
  { label: "Trees Planted", value: 2140 },
];

export default function HomeSection() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero */}
      <Section className="pt-10 pb-14">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="text-xs uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
              {t("bismillah")}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t("hero_title_1")}{" "}
              <span className="text-emerald-600">{t("hero_title_2")}</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl">
              {t("hero_desc")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/donate"
                className="rounded-xl bg-emerald-600 text-white px-5 py-3 font-semibold inline-flex items-center gap-2 hover:bg-emerald-700 transition"
              >
                <HandCoins className="h-5 w-5" /> {t("donate_now")}
              </Link>
              <Link
                href="/projects"
                className="rounded-xl border border-emerald-300/60 px-5 py-3 font-semibold inline-flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition"
              >
                {t("explore_projects")} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <StatsGrid items={stats} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-white/80 dark:bg-emerald-900/40 p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                <h3 className="text-lg font-bold">{t("quick_donation")}</h3>
              </div>
              <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-50/80">
                {t("choose_amount")}
              </p>

              <div className="mt-4">
                <QuickDonate />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <button className="rounded-lg border border-emerald-300/60 px-3 py-2 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                  {t("one_time")}
                </button>
                <button className="rounded-lg border border-emerald-300/60 px-3 py-2 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                  {t("recurring")}
                </button>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={t("custom_amount")}
                  className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 px-4 py-2 outline-none"
                />
                <div className="mt-2 text-[11px] text-emerald-700/70 dark:text-emerald-200/70">
                  {t("receipt_line")}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Projects Preview */}
      <Section id="projects" className="py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {t("current_campaigns")}
            </h2>
            <p className="text-sm text-emerald-800/80 dark:text-emerald-50/80">
              {t("support_realtime")}
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold hover:text-emerald-600 dark:hover:text-emerald-300"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const percent = (p.raised / p.goal) * 100;
            return (
              <motion.article
                key={p.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs rounded-full bg-emerald-100 dark:bg-emerald-800/40 px-2 py-1">
                    {p.tag}
                  </span>
                  <span className="text-xs font-semibold">
                    BDT {p.raised.toLocaleString()} / {p.goal.toLocaleString()}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-50/80">
                  {p.excerpt}
                </p>
                <div className="mt-4 space-y-2">
                  <ProgressBar value={percent} />
                  <div className="text-xs flex items-center justify-between">
                    <span>{Math.round(percent)}% funded</span>
                    <Link
                      href={`/projects`}
                      className="inline-flex items-center gap-1 font-semibold hover:text-emerald-600 dark:hover:text-emerald-300"
                    >
                      Donate <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Section>

      {/* Transparency & Reports */}
      <Section id="reports" className="py-10">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {t("radical_transparency")}
            </h2>
            <p className="mt-2 text-emerald-800/80 dark:text-emerald-50/80">
              {t("transparency_desc")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/reports"
                className="rounded-xl border border-emerald-300/60 px-4 py-2 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 inline-flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" /> {t("view_reports")}
              </Link>
              <Link
                href="/reports"
                className="rounded-xl border border-emerald-300/60 px-4 py-2 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 inline-flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" /> {t("finance_policy")}
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Latest Report: August 2025</span>
              <span className="text-emerald-700/70 dark:text-emerald-200/70">
                BDT 42,350 balance
              </span>
            </div>
            <div className="mt-4">
              <div className="space-y-2">
                {[68, 52, 75, 40, 84, 60].map((v, i) => (
                  <div
                    key={i}
                    className="h-2 rounded bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden"
                  >
                    <div
                      className="h-full bg-emerald-500 dark:bg-emerald-400"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-emerald-700/70 dark:text-emerald-200/70">
                Income vs. Expense trend (sample). Replace with live chart.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Events */}
      <Section id="events" className="py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {t("upcoming_activities")}
            </h2>
            <p className="text-sm text-emerald-800/80 dark:text-emerald-50/80">
              Distribution, reunions, tree planting, and more.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold hover:text-emerald-600 dark:hover:text-emerald-300"
          >
            Calendar <CalendarDays className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              d: "Fri 20 Sep",
              t: "Aid Distribution • Ward 4",
              k: "Distribution center, 3:30 PM",
            },
            { d: "Sat 21 Sep", t: "Volunteers Meetup", k: "Office, 10:30 AM" },
            {
              d: "Sun 29 Sep",
              t: "Tree Plantation",
              k: "School field, 8:00 AM",
            },
          ].map((e, i) => (
            <div
              key={i}
              className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5"
            >
              <div className="text-xs text-emerald-700/70 dark:text-emerald-200/70">
                {e.d}
              </div>
              <div className="mt-1 font-semibold">{e.t}</div>
              <div className="text-sm">{e.k}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer CTA */}
      <Section className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 grid lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              {t("generosity_headline")}
            </h3>
            <p className="mt-2 text-white/90">{t("generosity_desc")}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/donate"
              className="rounded-xl bg-white text-emerald-700 px-5 py-3 font-semibold hover:bg-emerald-50 transition"
            >
              {t("donate")}
            </Link>
            <Link
              href="/projects"
              className="rounded-xl border border-white/60 px-5 py-3 font-semibold hover:bg-white/10 transition"
            >
              {t("see_projects")}
            </Link>
          </div>
        </div>
      </Section>

      <footer className="border-t border-emerald-200/60 dark:border-emerald-800/60 py-8">
        <Section className="text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} {t("brand")} • {t("footer_rights")}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-emerald-600 dark:hover:text-emerald-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-emerald-600 dark:hover:text-emerald-300"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:text-emerald-600 dark:hover:text-emerald-300"
            >
              Contact
            </Link>
          </div>
        </Section>
      </footer>
    </div>
  );
}
