"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";

type MembershipRequest = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
};

export default function AdminMembersPage() {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"pending" | "approved" | "denied">(
    "pending"
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadRequests = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/membership-requests?status=${status}`
      );
      const json = await res.json();
      if (json.ok) {
        setRequests(json.items || []);
      } else {
        console.error("Failed to load requests:", json.error);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAction = async (id: string, action: "approve" | "deny") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/membership-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (json.ok) {
        await loadRequests();
      } else {
        alert(json.error || "Action failed");
      }
    } catch (error) {
      console.error("Error performing action:", error);
      alert("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "denied":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "denied":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section id="membership-requests-hero" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
            Membership Requests
          </h1>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
            Review and manage membership applications from community members
          </p>
        </motion.div>
      </Section>

      {/* Status Filter */}
      <Section id="status-filter" className="py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="flex bg-white dark:bg-emerald-900 rounded-xl p-1 shadow-lg">
            {[
              {
                value: "pending",
                label: "Pending",
                icon: Clock,
                count: requests.filter((r) => r.status === "pending").length,
              },
              {
                value: "approved",
                label: "Approved",
                icon: UserCheck,
                count: requests.filter((r) => r.status === "approved").length,
              },
              {
                value: "denied",
                label: "Denied",
                icon: UserX,
                count: requests.filter((r) => r.status === "denied").length,
              },
            ].map(({ value, label, icon: Icon, count }) => (
              <button
                key={value}
                onClick={() =>
                  setStatus(value as "pending" | "approved" | "denied")
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  status === value
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-800/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    status === value
                      ? "bg-white/20 text-white"
                      : "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Requests List */}
      <Section id="requests-list" className="py-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16"
          >
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <p className="text-emerald-700 dark:text-emerald-300">
                Loading requests...
              </p>
            </div>
          </motion.div>
        ) : requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-emerald-900 shadow-lg max-w-md mx-auto">
              <Users className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                No {status} requests
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300">
                {status === "pending"
                  ? "No pending membership requests at the moment."
                  : `No ${status} membership requests found.`}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {requests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-800/40">
                        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                          {request.name}
                        </h3>
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{request.email}</span>
                      </div>
                      {request.phone && (
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{request.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                            Notes
                          </span>
                        </div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-800/30 rounded-lg p-3">
                          {request.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {status === "pending" && (
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleAction(request._id, "approve")}
                        disabled={actionLoading === request._id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition-colors font-medium"
                      >
                        {actionLoading === request._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request._id, "deny")}
                        disabled={actionLoading === request._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition-colors font-medium"
                      >
                        {actionLoading === request._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>
    </div>
  );
}
