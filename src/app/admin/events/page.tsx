"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  category?: string;
  status: string;
  registrationRequired?: boolean;
  attendees?: string[] | number;
  contactInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

const statuses = ["All", "upcoming", "ongoing", "completed", "cancelled"];

interface CreateEventFormProps {
  onClose: () => void;
  onSuccess: (event: Event) => void;
}

interface EditEventFormProps {
  event: Event;
  onClose: () => void;
  onSuccess: (event: Event) => void;
}

function CreateEventForm({ onClose, onSuccess }: CreateEventFormProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    status: "upcoming",
    maxAttendees: "",
    registrationRequired: false,
    contactInfo: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        onSuccess(newEvent.event);
      } else {
        console.error("Failed to create event");
        alert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter event title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter event description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter event location"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
          Contact Info
        </label>
        <input
          type="text"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Email or phone number"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="registrationRequired"
          checked={formData.registrationRequired}
          onChange={handleChange}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
        />
        <label className="ml-2 block text-sm text-emerald-700 dark:text-emerald-300">
          Registration Required
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}

function EditEventForm({ event, onClose, onSuccess }: EditEventFormProps) {
  const [formData, setFormData] = React.useState({
    title: event.title,
    description: event.description,
    date: event.date.split("T")[0], // Convert to YYYY-MM-DD format
    time: event.time || "",
    location: event.location,
    status: event.status,
    registrationRequired: event.registrationRequired || false,
    contactInfo: event.contactInfo || "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/events/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        onSuccess(updatedEvent.event);
      } else {
        console.error("Failed to update event");
        alert("Failed to update event. Please try again.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter event title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter event description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter event location"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {statuses
              .filter((status) => status !== "All")
              .map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
            Contact Info
          </label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Email or phone number"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="registrationRequired"
          checked={formData.registrationRequired}
          onChange={handleChange}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
        />
        <label className="ml-2 block text-sm text-emerald-700 dark:text-emerald-300">
          Registration Required
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Event"}
        </button>
      </div>
    </form>
  );
}

export default function AdminEventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = React.useState<Event[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState("All");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = React.useState<Event | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch events from API
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  React.useEffect(() => {
    let filtered = events;

    if (selectedStatus !== "All") {
      filtered = filtered.filter((event) => event.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedStatus, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`/api/admin/events/${eventId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setEvents(events.filter((event) => event._id !== eventId));
        } else {
          console.error("Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleToggleStatus = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === "upcoming" ? "ongoing" : "upcoming";
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setEvents(
          events.map((event) =>
            event._id === eventId ? { ...event, status: newStatus } : event
          )
        );
      } else {
        console.error("Failed to update event status");
      }
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  return (
    <>
      <AnnouncementMarquee />

      <Section id="admin-events-hero" className="relative overflow-hidden">
        <GeometricBg />
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-emerald-950 dark:text-emerald-50 mb-6"
          >
            Manage Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-emerald-700 dark:text-emerald-300 mb-8 max-w-3xl mx-auto"
          >
            Create, manage, and monitor community events
          </motion.p>
        </div>
      </Section>

      <Section
        id="admin-events-controls"
        className="bg-emerald-50/30 dark:bg-emerald-900/10"
      >
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-emerald-200 dark:border-emerald-700 rounded-full bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="admin-events-grid">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
              Loading Events...
            </h3>
            <p className="text-emerald-600 dark:text-emerald-400">
              Please wait while we fetch your events.
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-emerald-300 dark:text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
              No Events Found
            </h3>
            <p className="text-emerald-600 dark:text-emerald-400">
              {searchTerm || selectedStatus !== "All"
                ? "No events match your search criteria."
                : "No events have been created yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === "upcoming"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300"
                            : event.status === "ongoing"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleStatus(event._id, event.status)
                        }
                        className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {event.status === "upcoming" ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-3">
                    {event.title}
                  </h3>

                  <p className="text-emerald-700 dark:text-emerald-300 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setViewingEvent(event);
                        setShowViewModal(true);
                      }}
                      className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setEditingEvent(event);
                        setShowEditModal(true);
                      }}
                      className="flex-1 border border-emerald-600 text-emerald-600 dark:text-emerald-400 py-2 px-4 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  Create New Event
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <CreateEventForm
                onClose={() => setShowCreateModal(false)}
                onSuccess={(newEvent) => {
                  setEvents([...events, newEvent]);
                  setShowCreateModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Event Details Modal */}
      {showViewModal && viewingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  Event Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    {viewingEvent.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewingEvent.status === "upcoming"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300"
                          : viewingEvent.status === "ongoing"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {viewingEvent.status.charAt(0).toUpperCase() +
                        viewingEvent.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Description
                  </h4>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    {viewingEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Date & Time
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(viewingEvent.date)}</span>
                      </div>
                      {viewingEvent.time && (
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <Clock className="h-4 w-4" />
                          <span>{viewingEvent.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Location
                    </h4>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <MapPin className="h-4 w-4" />
                      <span>{viewingEvent.location}</span>
                    </div>
                  </div>
                </div>

                {viewingEvent.contactInfo && (
                  <div>
                    <h4 className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                      Contact Information
                    </h4>
                    <p className="text-emerald-700 dark:text-emerald-300">
                      {viewingEvent.contactInfo}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                    Registration
                  </h4>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    {viewingEvent.registrationRequired
                      ? "Registration Required"
                      : "No Registration Required"}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setEditingEvent(viewingEvent);
                      setShowEditModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Edit Event
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="flex-1 px-4 py-2 border border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  Edit Event
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <EditEventForm
                event={editingEvent}
                onClose={() => setShowEditModal(false)}
                onSuccess={(updatedEvent) => {
                  setEvents(
                    events.map((event) =>
                      event._id === updatedEvent._id ? updatedEvent : event
                    )
                  );
                  setShowEditModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
