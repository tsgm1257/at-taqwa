"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  HandCoins,
  Receipt,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import Section from "./Section";
import GeometricBg from "./GeometricBg";
import AnnouncementMarquee from "./AnnouncementMarquee";
import StatsGrid from "./StatsGrid";
import QuickDonate from "./QuickDonate";
import ProgressBar from "./ProgressBar";
import { useLanguage } from "@/app/providers";

export default function HomeSection() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState([]);
  const [events, setEvents] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [projectsRes, eventsRes, reportsRes, statsRes] =
          await Promise.all([
            fetch("/api/projects"),
            fetch("/api/events"),
            fetch("/api/reports"),
            fetch("/api/stats"),
          ]);

        let allProjects = [];
        let allEvents = [];
        let allReports = [];

        // Process projects
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          allProjects = projectsData.items || [];
          setProjects(allProjects.slice(0, 3));
        } else {
          console.error("Failed to fetch projects:", projectsRes.status);
        }

        // Process events
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          allEvents = eventsData.events || [];
          setEvents(allEvents.slice(0, 3));
        }

        // Process reports
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          allReports = reportsData.items || [];
          const sortedReports = allReports.sort(
            (a, b) => new Date(b.month) - new Date(a.month)
          );
          setLatestReport(sortedReports[0] || null);
        }

        // Process stats
        let statsData = {
          activeProjects: allProjects.length,
          activeMembers: 0,
          totalRaised: 0,
          donorsThisMonth: 0,
        };

        if (statsRes.ok) {
          const statsResponse = await statsRes.json();
          if (statsResponse.ok) {
            statsData = statsResponse.stats;
          }
        } else {
          console.error("Failed to fetch stats:", statsRes.status);
        }

        setStats([
          { label: "Active Members", value: statsData.activeMembers },
          { label: "Donors This Month", value: statsData.donorsThisMonth },
          { 
            label: "Total Raised (BDT)", 
            value: statsData.totalRaised,
            subtitle: statsData.totalDonations && statsData.totalFeesPaid ? 
              `Donations: ৳${statsData.totalDonations.toLocaleString()} | Fees: ৳${statsData.totalFeesPaid.toLocaleString()}` : 
              undefined
          },
          { label: "Active Projects", value: statsData.activeProjects },
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback to default stats if API fails
        setStats([
          { label: "Active Members", value: 0 },
          { label: "Donors This Month", value: 0 },
          { label: "Funds Raised (BDT)", value: 0 },
          { label: "Active Projects", value: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

              <div className="mt-4">
                <div className="text-[11px] text-emerald-700/70 dark:text-emerald-200/70">
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
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-emerald-700 dark:text-emerald-300">
                No active projects at the moment.
              </p>
            </div>
          ) : (
            projects.map((p) => {
              const currentAmount = p.currentAmount || 0;
              const targetAmount = p.targetAmount || 0;
              const percent =
                targetAmount > 0
                  ? Math.round((currentAmount / targetAmount) * 100)
                  : 0;
              return (
                <motion.article
                  key={p._id}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs rounded-full bg-emerald-100 dark:bg-emerald-800/40 px-2 py-1">
                      {p.category || "General"}
                    </span>
                    <span className="text-xs font-semibold">
                      BDT {currentAmount.toLocaleString()} /{" "}
                      {targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                  <p className="mt-1 text-sm text-emerald-800/80 dark:text-emerald-50/80">
                    {p.description?.substring(0, 100)}...
                  </p>
                  <div className="mt-4 space-y-2">
                    <ProgressBar value={percent} />
                    <div className="text-xs flex items-center justify-between">
                      <span>{isNaN(percent) ? 0 : percent}% funded</span>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="inline-flex items-center gap-1 font-semibold hover:text-emerald-600 dark:hover:text-emerald-300"
                      >
                        Donate <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
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
            {latestReport ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    Latest Report: {latestReport.month}
                  </span>
                  <span className="text-emerald-700/70 dark:text-emerald-200/70">
                    BDT {latestReport.closingBalance?.toLocaleString() || 0}{" "}
                    balance
                  </span>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-emerald-700/70 dark:text-emerald-200/70">
                        Income
                      </div>
                      <div className="font-semibold">
                        BDT {latestReport.totalIncome?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-emerald-700/70 dark:text-emerald-200/70">
                        Expenses
                      </div>
                      <div className="font-semibold">
                        BDT {latestReport.totalExpense?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-emerald-700/70 dark:text-emerald-200/70">
                    Financial transparency for {latestReport.month}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                  No reports available yet
                </div>
                <div className="text-xs text-emerald-600/70 dark:text-emerald-300/70 mt-1">
                  Reports will appear here once created
                </div>
              </div>
            )}
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
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400" />
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-emerald-700 dark:text-emerald-300">
                No upcoming events scheduled.
              </p>
            </div>
          ) : (
            events.map((e, i) => {
              const eventDate = new Date(e.date);
              const formattedDate = eventDate.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              });
              const formattedTime = eventDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={e._id}
                  className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5"
                >
                  <div className="text-xs text-emerald-700/70 dark:text-emerald-200/70">
                    {formattedDate}
                  </div>
                  <div className="mt-1 font-semibold">{e.title}</div>
                  <div className="text-sm">
                    {e.location && `${e.location}, `}
                    {formattedTime}
                  </div>
                </div>
              );
            })
          )}
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

    </div>
  );
}
