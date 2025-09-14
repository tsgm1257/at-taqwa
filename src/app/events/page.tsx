"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

// Events will be fetched from API

export default function EventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = React.useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch events from API
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  React.useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split("T")[0];
      filtered = filtered.filter((event) => event.date === selectedDateStr);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedDate]);

  const formatDate = (dateString: string) => {
    // Extract just the date part to avoid timezone issues
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "TBD";

    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => {
      // Handle both string and Date formats
      const eventDate =
        event.date instanceof Date
          ? event.date.toISOString().split("T")[0]
          : event.date.split("T")[0];
      return eventDate === dateStr;
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const monthNames = [
    t("calendar.january"),
    t("calendar.february"),
    t("calendar.march"),
    t("calendar.april"),
    t("calendar.may"),
    t("calendar.june"),
    t("calendar.july"),
    t("calendar.august"),
    t("calendar.september"),
    t("calendar.october"),
    t("calendar.november"),
    t("calendar.december"),
  ];

  const dayNames = [
    t("calendar.sun"),
    t("calendar.mon"),
    t("calendar.tue"),
    t("calendar.wed"),
    t("calendar.thu"),
    t("calendar.fri"),
    t("calendar.sat"),
  ];

  return (
    <>
      <AnnouncementMarquee />

      <Section id="events-hero" className="relative overflow-hidden">
        <GeometricBg />
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-emerald-950 dark:text-emerald-50 mb-6"
          >
            {t("events.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-emerald-700 dark:text-emerald-300 mb-8 max-w-3xl mx-auto"
          >
            {t("events.subtitle")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-emerald-600 dark:text-emerald-400 max-w-4xl mx-auto"
          >
            {t("events.description")}
          </motion.p>
        </div>
      </Section>

      <Section
        id="events-calendar"
        className="bg-emerald-50/30 dark:bg-emerald-900/10 mt-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-emerald-900 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const today = new Date();
                      setCurrentDate(today);
                    }}
                    className="px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-700 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </button>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-10" />;
                  }

                  const dayEvents = getEventsForDate(day);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors relative ${
                        isToday(day)
                          ? "bg-emerald-600 text-white"
                          : isSelected(day)
                          ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
                          : "hover:bg-emerald-50 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
                      }`}
                    >
                      {day.getDate()}
                      {hasEvents && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((_, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="w-1 h-1 bg-emerald-500 rounded-full"
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="w-1 h-1 bg-emerald-300 rounded-full" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Clear selection button */}
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-full mt-4 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Search and Events List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <input
                  type="text"
                  placeholder={t("events.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-emerald-600 dark:text-emerald-400">
                    Loading events...
                  </p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-emerald-300 dark:text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                    {t("events.noEventsFound")}
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400">
                    {searchTerm || selectedDate
                      ? t("events.noEventsFiltered")
                      : t("events.noEventsMessage")}
                  </p>
                </div>
              ) : (
                filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id || event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-emerald-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 rounded-xl flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === "upcoming"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {t(
                              `events.status${
                                event.status.charAt(0).toUpperCase() +
                                event.status.slice(1)
                              }`
                            )}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300">
                            {event.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                          {event.title}
                        </h3>

                        <p
                          className="text-emerald-700 dark:text-emerald-300 mb-4 overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {event.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm text-emerald-600 dark:text-emerald-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(event.time || "")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="events-cta"
        className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl mx-4 md:mx-8 lg:mx-16"
      >
        <div className="text-center py-16 px-8">
          <h2 className="text-3xl font-bold mb-4">{t("events.ctaTitle")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t("events.ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              {t("events.proposeEvent")}
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors">
              {t("events.supportEvents")}
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}
