"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Search,
  Filter,
  CalendarDays,
  Calendar as CalendarIcon,
  Plus,
  Eye,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

type Event = {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  category?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  registrationRequired?: boolean;
  image?: string;
};

export default function EventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "calendar">("grid");

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setEvents([]);
        setLoading(false);
      });
  }, []);

  const filteredEvents = React.useMemo(() => {
    let filtered = events;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query) ||
          e.location?.toLowerCase().includes(query)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((e) => e.category === filterCategory);
    }

    // Sort by start date (upcoming first)
    filtered = filtered.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    return filtered;
  }, [events, searchQuery, filterCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    if (now < startDate) {
      return {
        status: "upcoming",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200",
      };
    } else if (now >= startDate && now <= endDate) {
      return {
        status: "ongoing",
        color:
          "bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200",
      };
    } else {
      return {
        status: "past",
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200",
      };
    }
  };

  const getEventStatusText = (event: Event) => {
    const { status } = getEventStatus(event);
    switch (status) {
      case "upcoming":
        return t("events.statusUpcoming");
      case "ongoing":
        return t("events.statusOngoing");
      case "past":
        return t("events.statusPast");
      default:
        return "Unknown";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "community":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800/40 dark:text-purple-200";
      case "charity":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-200";
      case "education":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200";
      case "religious":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800/40 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200";
    }
  };

  const getCategoryText = (category?: string) => {
    switch (category) {
      case "community":
        return t("events.categoryCommunity");
      case "charity":
        return t("events.categoryCharity");
      case "education":
        return t("events.categoryEducation");
      case "religious":
        return t("events.categoryReligious");
      default:
        return t("events.categoryGeneral");
    }
  };

  // Get unique categories for filter
  const categories = React.useMemo(() => {
    const cats = [...new Set(events.map((e) => e.category).filter(Boolean))];
    return ["all", ...cats];
  }, [events]);

  // Calculate upcoming events count
  const upcomingEvents = events.filter(
    (e) => new Date(e.start) > new Date()
  ).length;

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
              {t("events.subtitle")}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t("events.title")}
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              {t("events.description")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Calendar className="h-4 w-4" />
                <span>
                  {upcomingEvents} {t("events.upcomingCount")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Users className="h-4 w-4" />
                <span>{t("events.communityFocused")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <CalendarIcon className="h-4 w-4" />
                <span>{t("events.regularActivities")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Search and Filter */}
      <Section id="filters" className="py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">
              {t("events.filterEvents")}
            </span>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
              <input
                type="text"
                placeholder={t("events.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-sm outline-none focus:border-emerald-500 w-48"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-sm outline-none focus:border-emerald-500"
            >
              <option value="all">{t("events.allCategories")}</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {getCategoryText(category)}
                </option>
              ))}
            </select>
            <div className="flex rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm transition ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }`}
              >
                {t("events.gridView")}
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-2 text-sm transition ${
                  viewMode === "calendar"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }`}
              >
                {t("events.calendarView")}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Events Grid */}
      <Section id="events-grid" className="py-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm animate-pulse"
              >
                <div className="h-48 bg-emerald-200 dark:bg-emerald-800 rounded-xl mb-4"></div>
                <div className="h-6 w-3/4 bg-emerald-200 dark:bg-emerald-800 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-emerald-200 dark:bg-emerald-800 rounded mb-4"></div>
                <div className="h-4 w-full bg-emerald-200 dark:bg-emerald-800 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              {t("events.noEventsFound")}
            </h3>
            <p className="text-emerald-700/70 dark:text-emerald-200/70">
              {searchQuery || filterCategory !== "all"
                ? t("events.noEventsFiltered")
                : t("events.noEventsMessage")}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => {
              const eventStatus = getEventStatus(event);
              return (
                <motion.article
                  key={event._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {event.image && (
                    <div className="h-48 bg-emerald-100 dark:bg-emerald-800/40 rounded-xl mb-4 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs rounded-full px-2 py-1 font-medium ${eventStatus.color}`}
                      >
                        {getEventStatusText(event)}
                      </span>
                      {event.category && (
                        <span
                          className={`text-xs rounded-full px-2 py-1 font-medium ${getCategoryColor(
                            event.category
                          )}`}
                        >
                          {getCategoryText(event.category)}
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                    {event.title}
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.start)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.maxAttendees && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.currentAttendees || 0} / {event.maxAttendees}{" "}
                          {t("events.attendees")}
                        </span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-emerald-800/80 dark:text-emerald-50/80 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/events/${event._id}`}
                      className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {t("events.viewDetails")}
                    </Link>
                    {event.registrationRequired && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {t("events.registrationRequired")}
                      </span>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </Section>

      {/* Call to Action */}
      <Section id="cta" className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            {t("events.ctaTitle")}
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            {t("events.ctaDescription")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> {t("events.proposeEvent")}
            </Link>
            <Link
              href="/donate"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              {t("events.supportEvents")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
