"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Megaphone,
  Pin,
  Calendar,
  Users,
  ArrowRight,
  Bell,
  Clock,
  Filter,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

type Announcement = {
  _id: string;
  title: string;
  body: string;
  publishedAt: string;
  pinned: boolean;
  marquee: boolean;
  visibleTo?: "all" | "members" | "admins";
};

export default function AnnouncementsPage() {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "pinned" | "recent">(
    "all"
  );

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/announcements`)
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setAnnouncements([]);
        setLoading(false);
      });
  }, []);

  const filteredAnnouncements = React.useMemo(() => {
    let filtered = announcements;

    switch (filter) {
      case "pinned":
        filtered = announcements.filter((a) => a.pinned);
        break;
      case "recent":
        filtered = announcements
          .filter((a) => {
            const publishedDate = new Date(a.publishedAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return publishedDate >= weekAgo;
          })
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          );
        break;
      default:
        filtered = announcements.sort((a, b) => {
          // Pinned announcements first, then by date
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        });
    }

    return filtered;
  }, [announcements, filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getVisibilityColor = (visibleTo?: string) => {
    switch (visibleTo) {
      case "members":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200";
      case "admins":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800/40 dark:text-purple-200";
      default:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-200";
    }
  };

  const getVisibilityText = (visibleTo?: string) => {
    switch (visibleTo) {
      case "members":
        return "Members Only";
      case "admins":
        return "Admins Only";
      default:
        return "Public";
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section className="pt-10 pb-14">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
              Stay Informed
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Community <span className="text-emerald-600">Announcements</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Stay updated with the latest news, events, and important
              information from our community. Never miss an important update or
              opportunity to get involved.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Bell className="h-4 w-4" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Users className="h-4 w-4" />
                <span>Community Focused</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Calendar className="h-4 w-4" />
                <span>Event Notifications</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Filter Section */}
      <Section className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All", count: announcements.length },
              {
                value: "pinned",
                label: "Pinned",
                count: announcements.filter((a) => a.pinned).length,
              },
              {
                value: "recent",
                label: "Recent",
                count: announcements.filter((a) => {
                  const publishedDate = new Date(a.publishedAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return publishedDate >= weekAgo;
                }).length,
              },
            ].map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => setFilter(value as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === value
                    ? "bg-emerald-600 text-white"
                    : "bg-white/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-800/40"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Announcements Grid */}
      <Section className="py-10">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-16 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                    <div className="h-6 w-48 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                  </div>
                  <div className="h-4 w-20 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                  <div className="h-4 w-3/4 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              No Announcements Found
            </h3>
            <p className="text-emerald-700/70 dark:text-emerald-200/70">
              {filter === "all"
                ? "No announcements have been posted yet."
                : `No ${filter} announcements at the moment.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAnnouncements.map((announcement, index) => (
              <motion.article
                key={announcement._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {announcement.pinned && (
                      <div className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        <Pin className="h-3 w-3" />
                        <span>Pinned</span>
                      </div>
                    )}
                    <span
                      className={`text-xs rounded-full px-2 py-1 font-medium ${getVisibilityColor(
                        announcement.visibleTo
                      )}`}
                    >
                      {getVisibilityText(announcement.visibleTo)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-700/70 dark:text-emerald-200/70">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(announcement.publishedAt)}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                  {announcement.title}
                </h2>

                <div className="text-emerald-800/80 dark:text-emerald-50/80 whitespace-pre-wrap leading-relaxed">
                  {announcement.body}
                </div>

                {announcement.marquee && (
                  <div className="mt-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                      <Megaphone className="h-3 w-3" />
                      <span>Featured in announcement marquee</span>
                    </div>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </Section>

      {/* Call to Action */}
      <Section className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Stay Connected
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Don't miss important updates! Join our community to receive
            notifications about new announcements, events, and opportunities to
            help.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/membership/apply"
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Users className="h-5 w-5" /> Join Community
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
