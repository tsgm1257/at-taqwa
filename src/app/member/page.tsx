"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, CreditCard, Heart, Bell, ArrowRight } from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";
type Fee = {
  _id: string;
  status: "unpaid" | "partial" | "paid" | "waived";
};

export default function MemberDashboard() {
  const { t } = useLanguage();
  const [donations, setDonations] = React.useState([]);
  const [fees, setFees] = React.useState<Fee[]>([]);
  const [announcements, setAnnouncements] = React.useState([]);
  const [memberStats, setMemberStats] = React.useState({
    totalDonations: 0,
    totalContributed: 0,
    eventsAttended: 0,
    yearsActive: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsRes, feesRes, announcementsRes, statsRes] = await Promise.all([
          fetch("/api/member/donations"),
          fetch("/api/member/fees"),
          fetch("/api/announcements"),
          fetch("/api/member/stats"),
        ]);

        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setDonations(donationsData.items || []);
        }

        if (feesRes.ok) {
          const feesData = await feesRes.json();
          setFees(feesData.items || []);
        }

        if (announcementsRes.ok) {
          const announcementsData = await announcementsRes.json();
          setAnnouncements(announcementsData.announcements || []);
        }

        // Process member stats
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.ok) {
            setMemberStats({
              totalDonations: statsData.stats.totalDonations,
              totalContributed: statsData.stats.totalContributed,
              eventsAttended: statsData.stats.eventsAttended,
              yearsActive: statsData.stats.yearsActive,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const memberFeatures = [
    {
      title: t("member.myProfile"),
      description: t("member.myProfileDesc"),
      icon: User,
      href: "/member/profile",
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      stats: t("member.profileComplete"),
    },
    {
      title: t("member.monthlyFees"),
      description: t("member.monthlyFeesDesc"),
      icon: CreditCard,
      href: "/member/fees",
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      stats: `${fees.filter((f) => f.status === "paid").length}/${
        fees.length
      } ${t("member.paid")}`,
    },
    {
      title: t("member.myDonations"),
      description: t("member.myDonationsDesc"),
      icon: Heart,
      href: "/member/donations",
      color: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      stats: `${donations.length} ${t("member.donations")}`,
    },
    {
      title: t("member.announcementsEvents"),
      description: t("member.announcementsEventsDesc"),
      icon: Bell,
      href: "/announcements",
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      stats: `${announcements.length} ${t("member.updates")}`,
    },
  ];

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
              {t("member.dashboard")}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t("member.welcome")},{" "}
              <span className="text-emerald-600">
                {t("member.communityMember")}
              </span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              {t("member.welcomeDescription")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <User className="h-4 w-4" />
                <span>{t("member.memberAccess")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Heart className="h-4 w-4" />
                <span>{t("member.contributionTracking")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Bell className="h-4 w-4" />
                <span>{t("member.stayUpdated")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Member Features Grid */}
      <Section id="features" className="py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {memberFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={feature.href}>
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${feature.color}`}>
                        <IconComponent
                          className={`h-6 w-6 ${feature.iconColor}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                            {feature.title}
                          </h3>
                          <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-sm text-emerald-700/80 dark:text-emerald-200/80 mb-3">
                          {feature.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {feature.stats}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Quick Stats */}
      <Section id="stats" className="py-8">
        <div className="grid md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {memberStats.totalDonations}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Donations
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              BDT {memberStats.totalContributed.toLocaleString()}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Contributed
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {memberStats.eventsAttended}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Events Attended
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {memberStats.yearsActive}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Years Active
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section id="cta" className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Continue your journey of giving and community service. Explore new
            projects, attend events, and help us create positive change in our
            community.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/donate"
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Heart className="h-5 w-5" /> Make a Donation
            </Link>
            <Link
              href="/events"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              View Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
