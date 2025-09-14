"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  FileText,
  Heart,
  Bell,
  Settings,
  ArrowRight,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

export default function UserDashboard() {
  const { t } = useLanguage();
  const [donations, setDonations] = React.useState([]);
  const [announcements, setAnnouncements] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsRes, announcementsRes] = await Promise.all([
          fetch("/api/member/donations"),
          fetch("/api/announcements"),
        ]);

        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setDonations(donationsData.items || []);
        }

        if (announcementsRes.ok) {
          const announcementsData = await announcementsRes.json();
          setAnnouncements(announcementsData.announcements || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section id="hero" className="pt-10 pb-14">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
              {t("user.dashboard")}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t("user.welcomeToYour")}{" "}
              <span className="text-emerald-600">{t("user.dashboard")}</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              {t("user.welcomeDescription")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <User className="h-4 w-4" />
                <span>{t("user.profileManagement")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Bell className="h-4 w-4" />
                <span>{t("user.announcements")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Heart className="h-4 w-4" />
                <span>{t("user.community")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Quick Actions */}
      <Section id="actions" className="py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link
              href="/user/profile"
              className="block rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-800/40 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700/40 transition">
                  <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {t("user.profile")}
                  </h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                    {t("user.manageYourInformation")}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/user/donations"
              className="block rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-800/40 group-hover:bg-red-200 dark:group-hover:bg-red-700/40 transition">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {t("user.myDonations")}
                  </h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                    {t("user.trackYourContributions")}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/announcements"
              className="block rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/40 transition">
                  <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {t("user.announcements")}
                  </h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                    {announcements.length} {t("user.updates")}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/projects"
              className="block rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-800/40 group-hover:bg-green-200 dark:group-hover:bg-green-700/40 transition">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {t("user.projects")}
                  </h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                    {t("user.viewInitiatives")}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/membership/apply"
              className="block rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-800/40 group-hover:bg-purple-200 dark:group-hover:bg-purple-700/40 transition">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    Apply for Membership
                  </h3>
                  <p className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                    Become a member
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Quick Stats */}
      <Section id="stats" className="py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 text-center"
          >
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              Community
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Stay connected with our community initiatives and events
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              Updates
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Stay updated with {announcements.length} announcements and project
              updates
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 text-center"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              Growth
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Apply for membership to access more features
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section id="cta" className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to Get More Involved?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Apply for membership to access exclusive features, participate in
            community events, and contribute to our charitable initiatives.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/membership/apply"
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Heart className="h-5 w-5" /> Apply for Membership
            </Link>
            <Link
              href="/projects"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              View Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
