"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Target,
  DollarSign,
  Tag,
  Clock,
  CheckCircle,
} from "lucide-react";
import DonateButton from "@/components/DonateButton";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";

type Project = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  image?: string;
  status: "active" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProjectDetail({
  params,
}: {
  params: { slug: string };
}) {
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${params.slug}`);
        if (!res.ok) {
          throw new Error("Project not found");
        }
        const json = await res.json();
        setProject(json.item || null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch project"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950">
        <GeometricBg />
        <Section className="pt-10 pb-14">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-emerald-200 dark:bg-emerald-800 rounded-xl mb-6"></div>
              <div className="h-80 bg-emerald-200 dark:bg-emerald-800 rounded-2xl mb-6"></div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded mb-2"></div>
                <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded mb-2"></div>
              </div>
              <div className="h-32 bg-emerald-200 dark:bg-emerald-800 rounded-xl"></div>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950">
        <GeometricBg />
        <Section className="pt-10 pb-14">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
              Project Not Found
            </h1>
            <p className="text-emerald-700 dark:text-emerald-200">
              The project you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </Section>
      </div>
    );
  }

  const p = project;

  const progress =
    p.targetAmount && p.targetAmount > 0
      ? Math.min(100, Math.round((p.currentAmount / p.targetAmount) * 100))
      : 0;

  const formatCurrency = (amount: number) => {
    const safeAmount =
      isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "paused":
        return "Paused";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
      <GeometricBg />

      <Section className="pt-10 pb-14">
        <div className="max-w-4xl mx-auto">
          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span
                className={`text-xs rounded-full px-3 py-1 font-medium ${getStatusColor(
                  p.status
                )}`}
              >
                {getStatusText(p.status)}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">•</span>
              <span className="text-sm text-emerald-700 dark:text-emerald-200">
                {p.category}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              {p.title}
            </h1>

            <p className="text-lg text-emerald-800/80 dark:text-emerald-50/80 max-w-3xl mx-auto">
              {p.description}
            </p>
          </motion.div>

          {/* Project Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-80 sm:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Project Image
                    </p>
                    <p className="text-sm text-emerald-500 dark:text-emerald-500">
                      No image available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Project Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {formatCurrency(p.currentAmount)}
              </div>
              <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                Raised
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {formatCurrency(p.targetAmount)}
              </div>
              <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                Target
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {isNaN(progress) ? 0 : progress}%
              </div>
              <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                Progress
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-emerald-700 dark:text-emerald-200">
                  Fundraising Progress
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {isNaN(progress) ? 0 : progress}% Complete
                </span>
              </div>
              <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${isNaN(progress) ? 0 : progress}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Project Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      Started
                    </div>
                    <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                      {formatDate(p.startDate)}
                    </div>
                  </div>
                </div>
                {p.endDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        Ends
                      </div>
                      <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                        {formatDate(p.endDate)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-emerald-600" />
                Project Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      Category
                    </div>
                    <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                      {p.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      Status
                    </div>
                    <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                      {getStatusText(p.status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Donate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-8">
              <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
                Support This Project
              </h3>
              <p className="text-emerald-700 dark:text-emerald-200 mb-6">
                Help us reach our goal and make a positive impact in the
                community.
              </p>
              <DonateButton projectSlug={p.slug} />
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
