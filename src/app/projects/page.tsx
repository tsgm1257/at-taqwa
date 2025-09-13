"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, HandCoins, Target, Users, Calendar } from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import ProgressBar from "@/components/ProgressBar";
import { useLanguage } from "@/app/providers";

type Project = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  coverImageUrl?: string;
  status: "active" | "completed" | "paused";
  startDate?: string;
  endDate?: string;
};

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/projects`,
    { cache: "no-store" }
  );
  const json = await res.json();
  return json.items || [];
}

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200";
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
              Our Impact
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Projects & <span className="text-emerald-600">Campaigns</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Support our community initiatives and track real-time progress.
              Every contribution makes a difference in building a better
              tomorrow.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link
                href="/donate"
                className="rounded-xl bg-emerald-600 text-white px-5 py-3 font-semibold inline-flex items-center gap-2 hover:bg-emerald-700 transition"
              >
                <HandCoins className="h-5 w-5" /> Donate Now
              </Link>
              <Link
                href="/reports"
                className="rounded-xl border border-emerald-300/60 px-5 py-3 font-semibold inline-flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition"
              >
                View Reports <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Projects Grid */}
      <Section className="py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Current Campaigns
            </h2>
            <p className="text-sm text-emerald-800/80 dark:text-emerald-50/80">
              Support a cause and track progress in real time.
            </p>
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5 shadow-sm animate-pulse"
              >
                <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded mb-3"></div>
                <div className="h-6 bg-emerald-200 dark:bg-emerald-800 rounded mb-2"></div>
                <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded mb-4"></div>
                <div className="h-2 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              No Projects Yet
            </h3>
            <p className="text-emerald-700/70 dark:text-emerald-200/70">
              Check back soon for new campaigns and initiatives.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const progress = project.targetAmount
                ? Math.min(
                    100,
                    Math.round(
                      (project.raisedAmount / project.targetAmount) * 100
                    )
                  )
                : 0;
              return (
                <motion.article
                  key={project._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {project.coverImageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs rounded-full px-2 py-1 font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {getStatusText(project.status)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                      BDT {project.raisedAmount.toLocaleString()} /{" "}
                      {project.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                    {project.title}
                  </h3>

                  <p className="text-sm text-emerald-800/80 dark:text-emerald-50/80 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="space-y-3">
                    <ProgressBar value={progress} />
                    <div className="text-xs flex items-center justify-between">
                      <span className="text-emerald-700/70 dark:text-emerald-200/70">
                        {progress}% funded
                      </span>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 font-semibold hover:text-emerald-600 dark:hover:text-emerald-300 transition"
                      >
                        View Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="w-full rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold inline-flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
                    >
                      <HandCoins className="h-4 w-4" /> Donate Now
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </Section>

      {/* Call to Action */}
      <Section className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join our community of donors and volunteers. Every contribution, no
            matter the size, helps us build a better future for our village.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/donate"
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <HandCoins className="h-5 w-5" /> Donate Now
            </Link>
            <Link
              href="/membership/apply"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <Users className="h-5 w-5" /> Join Us
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
