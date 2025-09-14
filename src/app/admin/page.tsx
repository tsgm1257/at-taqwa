"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  UserPlus,
  Megaphone,
  DollarSign,
  Calendar,
  CreditCard,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

type MembershipRequest = {
  _id: string;
  status: "pending" | "approved" | "denied";
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [events, setEvents] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [membershipRequests, setMembershipRequests] = React.useState<
    MembershipRequest[]
  >([]);
  const [announcements, setAnnouncements] = React.useState([]);
  const [reports, setReports] = React.useState([]);
  const [donations, setDonations] = React.useState([]);
  const [fees, setFees] = React.useState([]);
  const [stats, setStats] = React.useState({
    totalMembers: 0,
    activeProjects: 0,
    pendingRequests: 0,
    totalEvents: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          eventsResponse,
          projectsResponse,
          membershipResponse,
          announcementsResponse,
          reportsResponse,
          donationsResponse,
          feesResponse,
          statsResponse,
        ] = await Promise.all([
          fetch("/api/admin/events"),
          fetch("/api/admin/projects"),
          fetch("/api/admin/membership-requests"),
          fetch("/api/admin/announcements"),
          fetch("/api/admin/reports"),
          fetch("/api/admin/donations"),
          fetch("/api/admin/fees"),
          fetch("/api/stats"),
        ]);

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events || []);
        }

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects || []);
        }

        if (membershipResponse.ok) {
          const membershipData = await membershipResponse.json();
          setMembershipRequests(membershipData.requests || []);
        }

        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json();
          setAnnouncements(announcementsData.announcements || []);
        }

        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json();
          setReports(reportsData.reports || []);
        }

        if (donationsResponse.ok) {
          const donationsData = await donationsResponse.json();
          setDonations(donationsData.items || []);
        }

        if (feesResponse.ok) {
          const feesData = await feesResponse.json();
          setFees(feesData.items || []);
        }

        // Process stats
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.ok) {
            setStats({
              totalMembers: statsData.stats.activeMembers,
              activeProjects: statsData.stats.activeProjects,
              pendingRequests: membershipRequests.filter((r) => r.status === "pending").length,
              totalEvents: events.length,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [events.length, membershipRequests]);

  const adminFeatures = [
    {
      title: t("admin.myProfile"),
      description: t("admin.myProfileDesc"),
      icon: Shield,
      href: "/admin/profile",
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      stats: t("admin.adminProfile"),
    },
    {
      title: t("admin.manageProjects"),
      description: t("admin.manageProjectsDesc"),
      icon: BarChart3,
      href: "/admin/projects",
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      stats: `${projects.length} ${t("admin.activeProjects")}`,
    },
    {
      title: t("admin.membershipRequests"),
      description: t("admin.membershipRequestsDesc"),
      icon: UserPlus,
      href: "/admin/members",
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      stats: `${
        membershipRequests.filter((r) => r.status === "pending").length
      } ${t("admin.pendingRequests")}`,
    },
    {
      title: t("admin.manageEvents"),
      description: t("admin.manageEventsDesc"),
      icon: Calendar,
      href: "/admin/events",
      color: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      stats: `${events.length} ${t("admin.totalEvents")}`,
    },
    {
      title: t("admin.announcements"),
      description: t("admin.announcementsDesc"),
      icon: Megaphone,
      href: "/admin/announcements",
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      stats: `${announcements.length} ${t("admin.activeAnnouncements")}`,
    },
    {
      title: t("admin.financialReports"),
      description: t("admin.financialReportsDesc"),
      icon: DollarSign,
      href: "/admin/reports",
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      stats: `${reports.length} ${t("admin.monthlyReports")}`,
    },
    {
      title: t("admin.donationManagement"),
      description: t("admin.donationManagementDesc"),
      icon: DollarSign,
      href: "/admin/donations",
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      stats: `${donations.length} ${t("admin.totalDonations")}`,
    },
    {
      title: t("admin.monthlyFees"),
      description: t("admin.monthlyFeesDesc"),
      icon: CreditCard,
      href: "/admin/fees",
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      stats: `${fees.length} ${t("admin.feeRecords")}`,
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
              {t("admin.dashboard")}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t("admin.welcome")},{" "}
              <span className="text-emerald-600">
                {t("admin.administrator")}
              </span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              {t("admin.welcomeDescription")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Shield className="h-4 w-4" />
                <span>{t("admin.fullAccess")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Users className="h-4 w-4" />
                <span>{t("admin.communityManagement")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Settings className="h-4 w-4" />
                <span>{t("admin.systemControl")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Admin Features Grid */}
      <Section id="features" className="py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {adminFeatures.map((feature, index) => {
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
              {stats.totalMembers}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Members
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.activeProjects}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Active Projects
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.pendingRequests}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Pending Requests
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.totalEvents}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Events
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section id="cta" className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Need Help Managing the Foundation?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Access comprehensive admin tools, detailed analytics, and community
            management features to ensure smooth operations and maximum impact.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/admin/events"
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Calendar className="h-5 w-5" /> Manage Events
            </Link>
            <Link
              href="/admin/members"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" /> Manage Members
            </Link>
            <Link
              href="/admin/reports"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              View Reports <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
