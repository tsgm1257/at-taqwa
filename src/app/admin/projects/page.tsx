"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Target,
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";

type Project = {
  _id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: "active" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  category: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(
    null
  );

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data.items || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p._id !== projectId));
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  // Calculate summary statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalTarget = projects.reduce((sum, p) => sum + p.targetAmount, 0);
  const totalRaised = projects.reduce((sum, p) => sum + p.currentAmount, 0);

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
              Project Management
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Manage <span className="text-emerald-600">Projects</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Create, update, and monitor fundraising campaigns. Track progress,
              manage donations, and ensure successful project completion.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <BarChart3 className="h-4 w-4" />
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Target className="h-4 w-4" />
                <span>Goal Management</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
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
              {totalProjects}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Projects
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {activeProjects}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Active Projects
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalTarget)}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Target
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(totalRaised)}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Raised
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Action Bar */}
      <Section id="actions" className="py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Project Management</span>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-xl bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create New Project
          </button>
        </div>
      </Section>

      {/* Projects Grid */}
      <Section id="projects" className="py-10">
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
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              No Projects Found
            </h3>
            <p className="text-emerald-700/70 dark:text-emerald-200/70">
              Create your first project to start fundraising for your community.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {project.image && (
                  <div className="h-48 bg-emerald-100 dark:bg-emerald-800/40 rounded-xl mb-4 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs rounded-full px-2 py-1 font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                  {project.title}
                </h2>

                <p className="text-sm text-emerald-800/80 dark:text-emerald-50/80 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-emerald-700 dark:text-emerald-200">
                      {formatCurrency(project.currentAmount)}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-200">
                      {formatCurrency(project.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getProgressPercentage(
                          project.currentAmount,
                          project.targetAmount
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    {getProgressPercentage(
                      project.currentAmount,
                      project.targetAmount
                    ).toFixed(1)}
                    % funded
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                    <Calendar className="h-4 w-4" />
                    <span>Started: {formatDate(project.startDate)}</span>
                  </div>
                  {project.endDate && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                      <Clock className="h-4 w-4" />
                      <span>Ends: {formatDate(project.endDate)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                    <Target className="h-4 w-4" />
                    <span>Category: {project.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/projects/${project._id}`}
                    className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-4 py-2 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition inline-flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition inline-flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
            Need Help Managing Projects?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Create impactful fundraising campaigns, track progress in real-time,
            and ensure successful project completion with our comprehensive
            project management tools.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> Create Project
            </button>
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
