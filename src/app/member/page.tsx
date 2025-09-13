"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, CreditCard, Heart, Bell, ArrowRight } from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";

export default function MemberDashboard() {
  const memberFeatures = [
    {
      title: "My Profile",
      description:
        "Update your personal information, contact details, and profile photo.",
      icon: User,
      href: "/member/profile",
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      stats: "Profile Complete",
    },
    {
      title: "Monthly Fees",
      description:
        "View your membership dues, payment history, and upcoming payments.",
      icon: CreditCard,
      href: "/member/fees",
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      stats: "All Paid",
    },
    {
      title: "My Donations",
      description:
        "Track your donation history and contribute to ongoing campaigns.",
      icon: Heart,
      href: "/member/donations",
      color: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      stats: "12 Donations",
    },
    {
      title: "Announcements & Events",
      description:
        "Stay updated with the latest foundation news and community events.",
      icon: Bell,
      href: "/announcements",
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      stats: "3 New Updates",
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
              Member Dashboard
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Welcome,{" "}
              <span className="text-emerald-600">Community Member</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Manage your membership, track your contributions, and stay
              connected with our community&apos;s activities and charitable
              initiatives.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <User className="h-4 w-4" />
                <span>Member Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Heart className="h-4 w-4" />
                <span>Contribution Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Bell className="h-4 w-4" />
                <span>Stay Updated</span>
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
              12
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
              BDT 15,000
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
              6
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
              2
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
