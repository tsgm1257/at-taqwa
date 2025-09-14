"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Pin,
  Calendar,
  ArrowRight,
  BarChart3,
  X,
  Save,
  Users,
  Shield,
  Globe,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";

type Announcement = {
  _id: string;
  title: string;
  body: string;
  pinned: boolean;
  marquee: boolean;
  visibleTo: "all" | "members" | "admins";
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    React.useState<Announcement | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    body: "",
    pinned: false,
    marquee: false,
    visibleTo: "all" as "all" | "members" | "admins",
  });
  const [formLoading, setFormLoading] = React.useState(false);

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/admin/announcements");
      const data = await response.json();
      setAnnouncements(data.items || []);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      body: "",
      pinned: false,
      marquee: false,
      visibleTo: "all",
    });
    setShowCreateForm(false);
    setEditingAnnouncement(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const announcementData = {
        ...formData,
        publishedAt: new Date().toISOString(),
      };

      const url = editingAnnouncement
        ? `/api/admin/announcements/${editingAnnouncement._id}`
        : "/api/admin/announcements";

      const method = editingAnnouncement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcementData),
      });

      if (response.ok) {
        await fetchAnnouncements();
        resetForm();
        alert(
          editingAnnouncement
            ? "Announcement updated successfully!"
            : "Announcement created successfully!"
        );
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save announcement");
      }
    } catch (error) {
      console.error("Failed to save announcement:", error);
      alert("Failed to save announcement");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      body: announcement.body,
      pinned: announcement.pinned,
      marquee: announcement.marquee,
      visibleTo: announcement.visibleTo,
    });
    setEditingAnnouncement(announcement);
    setShowCreateForm(true);
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const response = await fetch(
        `/api/admin/announcements/${announcementId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAnnouncements(announcements.filter((a) => a._id !== announcementId));
      } else {
        alert("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  const toggleMarquee = async (
    announcementId: string,
    currentMarquee: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/admin/announcements/${announcementId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ marquee: !currentMarquee }),
        }
      );

      if (response.ok) {
        await fetchAnnouncements();
      } else {
        alert("Failed to update marquee status");
      }
    } catch (error) {
      console.error("Failed to update marquee status:", error);
      alert("Failed to update marquee status");
    }
  };

  const getVisibilityIcon = (visibleTo: string) => {
    switch (visibleTo) {
      case "all":
        return <Globe className="h-4 w-4" />;
      case "members":
        return <Users className="h-4 w-4" />;
      case "admins":
        return <Shield className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityText = (visibleTo: string) => {
    switch (visibleTo) {
      case "all":
        return "Everyone";
      case "members":
        return "Members Only";
      case "admins":
        return "Admins Only";
      default:
        return "Everyone";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate summary statistics
  const totalAnnouncements = announcements.length;
  const pinnedAnnouncements = announcements.filter((a) => a.pinned).length;
  const marqueeAnnouncements = announcements.filter((a) => a.marquee).length;
  const publicAnnouncements = announcements.filter(
    (a) => a.visibleTo === "all"
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
              Announcement Management
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Manage <span className="text-emerald-600">Announcements</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Create, update, and manage community announcements. Control
              visibility, pin important messages, and manage marquee display.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Megaphone className="h-4 w-4" />
                <span>Community Updates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Pin className="h-4 w-4" />
                <span>Pin Important</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <BarChart3 className="h-4 w-4" />
                <span>Marquee Control</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Summary Stats */}
      <Section id="stats" className="py-6">
        <div className="grid md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalAnnouncements}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Announcements
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {pinnedAnnouncements}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Pinned
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {marqueeAnnouncements}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              In Marquee
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {publicAnnouncements}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Public
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Action Bar */}
      <Section id="actions" className="py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Announcement Management</span>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-xl bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Announcement
          </button>
        </div>
      </Section>

      {/* Announcements Grid */}
      <Section id="announcements" className="py-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm animate-pulse"
              >
                <div className="h-6 w-3/4 bg-emerald-200 dark:bg-emerald-800 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-emerald-200 dark:bg-emerald-800 rounded mb-4"></div>
                <div className="h-4 w-full bg-emerald-200 dark:bg-emerald-800 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              No Announcements Found
            </h3>
            <p className="text-emerald-700/70 dark:text-emerald-200/70">
              Create your first announcement to start communicating with the
              community.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {announcement.pinned && (
                      <span className="text-xs rounded-full px-2 py-1 font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-200">
                        <Pin className="h-3 w-3 inline mr-1" />
                        Pinned
                      </span>
                    )}
                    {announcement.marquee && (
                      <span className="text-xs rounded-full px-2 py-1 font-medium bg-purple-100 text-purple-800 dark:bg-purple-800/40 dark:text-purple-200">
                        <BarChart3 className="h-3 w-3 inline mr-1" />
                        Marquee
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                  {announcement.title}
                </h2>

                <p className="text-sm text-emerald-800/80 dark:text-emerald-50/80 mb-4 line-clamp-3">
                  {announcement.body}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Published: {formatDate(announcement.publishedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                    {getVisibilityIcon(announcement.visibleTo)}
                    <span>
                      Visible to: {getVisibilityText(announcement.visibleTo)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-4 py-2 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition inline-flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      className="rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition inline-flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      toggleMarquee(announcement._id, announcement.marquee)
                    }
                    className={`rounded-xl px-4 py-2 font-semibold transition inline-flex items-center gap-2 ${
                      announcement.marquee
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-800/40 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-700/40"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/40"
                    }`}
                  >
                    {announcement.marquee ? (
                      <BarChart3 className="h-4 w-4" />
                    ) : (
                      <BarChart3 className="h-4 w-4" />
                    )}
                    {announcement.marquee ? "In Marquee" : "Add to Marquee"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      {/* Call to Action */}
      <Section id="cta" className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Need Help Managing Announcements?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Create impactful announcements, control visibility, and manage
            marquee display to keep your community informed and engaged.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> Create Announcement
            </button>
            <Link
              href="/announcements"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              View Public Page <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Announcement Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {editingAnnouncement
                  ? "Edit Announcement"
                  : "Create New Announcement"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-lg transition"
              >
                <X className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Content *
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter announcement content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Visibility
                </label>
                <select
                  name="visibleTo"
                  value={formData.visibleTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">Everyone</option>
                  <option value="members">Members Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="pinned"
                    checked={formData.pinned}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                    <Pin className="h-4 w-4" />
                    Pin this announcement
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="marquee"
                    checked={formData.marquee}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Show in marquee
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 rounded-xl bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {formLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingAnnouncement ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingAnnouncement
                        ? "Update Announcement"
                        : "Create Announcement"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
