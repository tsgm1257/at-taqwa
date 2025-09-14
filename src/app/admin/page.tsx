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
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import DonationHistory from "@/components/DonationHistory";
import MonthlyFees from "@/components/MonthlyFees";

export default function AdminDashboard() {
  const [donations, setDonations] = React.useState([]);
  const [fees, setFees] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [donationsResponse, feesResponse, eventsResponse] =
          await Promise.all([
            fetch("/api/admin/donations"),
            fetch("/api/admin/fees"),
            fetch("/api/admin/events"),
          ]);

        if (donationsResponse.ok) {
          const donationsData = await donationsResponse.json();
          setDonations(donationsData.items || []);
        }

        if (feesResponse.ok) {
          const feesData = await feesResponse.json();
          setFees(feesData.items || []);
        }

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const adminFeatures = [
    {
      title: "My Profile",
      description:
        "Update your administrator profile, contact details, and system preferences.",
      icon: Shield,
      href: "/admin/profile",
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      stats: "Admin Profile",
    },
    {
      title: "Manage Projects & Campaigns",
      description:
        "Create, update, and monitor fundraising campaigns with real-time progress tracking.",
      icon: BarChart3,
      href: "/admin/projects",
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      stats: "12 Active Projects",
    },
    {
      title: "Membership Requests",
      description:
        "Review and approve member applications to grow our community.",
      icon: UserPlus,
      href: "/admin/members",
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      stats: "5 Pending Requests",
    },
    {
      title: "Manage Events",
      description:
        "Create, schedule, and manage community events with attendee tracking and notifications.",
      icon: Calendar,
      href: "/admin/events",
      color: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      stats: `${events.length} Total Events`,
    },
    {
      title: "Announcements",
      description:
        "Publish important notices, updates, and community communications.",
      icon: Megaphone,
      href: "/admin/announcements",
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      stats: "Active Announcements",
    },
    {
      title: "Financial Reports",
      description:
        "Upload and manage monthly financial reports for complete transparency.",
      icon: DollarSign,
      href: "/admin/reports",
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      stats: "Monthly Reports",
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
              Admin Dashboard
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Welcome, <span className="text-emerald-600">Administrator</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Manage your foundation&apos;s operations, oversee community
              activities, and ensure transparent governance of all charitable
              initiatives.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Shield className="h-4 w-4" />
                <span>Full Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Users className="h-4 w-4" />
                <span>Community Management</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Settings className="h-4 w-4" />
                <span>System Control</span>
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
              156
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
              12
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
              5
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
              {events.length}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Events
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Monthly Fees */}
      <Section id="fees" className="py-10">
        <div className="max-w-6xl mx-auto">
          <MonthlyFees fees={fees} loading={loading} />
        </div>
      </Section>

      {/* Donation History */}
      <Section id="donations" className="py-10">
        <div className="max-w-6xl mx-auto">
          <DonationHistory donations={donations} loading={loading} />
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
