"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Shield,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  DollarSign,
  ArrowRight,
  FileText,
  PieChart,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

type Report = {
  _id: string;
  title: string;
  month: string; // "YYYY-MM"
  currency: string;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  openingBalance?: number;
  summary?: string;
  published?: boolean;
  preparedBy?: string;
};

export default function ReportsPage() {
  const { t } = useLanguage();
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchYear, setSearchYear] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredReports, setFilteredReports] = React.useState<Report[]>([]);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/reports`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data.items || []);
        setFilteredReports(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setReports([]);
        setFilteredReports([]);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    let filtered = reports;

    if (searchYear) {
      filtered = filtered.filter((r) => r.month.startsWith(searchYear));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.summary?.toLowerCase().includes(query) ||
          r.month.includes(query)
      );
    }

    // Sort by month (newest first)
    filtered = filtered.sort((a, b) => b.month.localeCompare(a.month));

    setFilteredReports(filtered);
  }, [reports, searchYear, searchQuery]);

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const formatCurrency = (amount: number, currency: string = "BDT") => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("BDT", currency);
  };

  const getNetChange = (report: Report) => {
    return report.totalIncome - report.totalExpense;
  };

  const getNetChangeColor = (report: Report) => {
    const change = getNetChange(report);
    return change >= 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const getNetChangeIcon = (report: Report) => {
    const change = getNetChange(report);
    return change >= 0 ? TrendingUp : TrendingDown;
  };

  // Calculate summary statistics
  const totalIncome = reports.reduce((sum, r) => sum + r.totalIncome, 0);
  const totalExpense = reports.reduce((sum, r) => sum + r.totalExpense, 0);
  const netChange = totalIncome - totalExpense;
  const latestReport = reports.sort((a, b) =>
    b.month.localeCompare(a.month)
  )[0];

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
              Financial Transparency
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Financial <span className="text-emerald-600">Reports</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Complete transparency in our financial operations. Every donation,
              expense, and balance is documented and publicly available for your
              review and trust.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Shield className="h-4 w-4" />
                <span>100% Transparent</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <BarChart3 className="h-4 w-4" />
                <span>Monthly Reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <DollarSign className="h-4 w-4" />
                <span>Detailed Breakdown</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Summary Stats */}
      <Section className="py-6">
        <div className="grid md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome)}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Income
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalExpense)}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Expenses
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div
              className={`text-2xl font-bold ${
                netChange >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(Math.abs(netChange))}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Net Change
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {latestReport
                ? formatCurrency(latestReport.closingBalance)
                : "N/A"}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Current Balance
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Search and Filter */}
      <Section className="py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Filter Reports:</span>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-sm outline-none focus:border-emerald-500 w-48"
              />
            </div>
            <div className="relative">
              <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600" />
              <input
                type="text"
                placeholder="Year (e.g., 2025)"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 text-sm outline-none focus:border-emerald-500 w-32"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Reports Grid */}
      <Section className="py-10">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-48 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                  <div className="h-6 w-20 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="h-16 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                  <div className="h-16 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                  <div className="h-16 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              No Reports Found
            </h3>
            <p className="text-emerald-700/70 dark:text-emerald-200/70">
              {searchYear || searchQuery
                ? "No reports match your search criteria."
                : "No financial reports have been published yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report, index) => {
              const NetChangeIcon = getNetChangeIcon(report);
              return (
                <motion.article
                  key={report._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                        {report.title}
                      </h2>
                      <span className="text-xs rounded-full bg-emerald-100 dark:bg-emerald-800/40 px-2 py-1 font-medium text-emerald-700 dark:text-emerald-200">
                        {formatMonth(report.month)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/reports/${report.month}`}
                        className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(report.totalIncome)}
                      </div>
                      <div className="text-xs text-green-700/70 dark:text-green-200/70">
                        Total Income
                      </div>
                    </div>

                    <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(report.totalExpense)}
                      </div>
                      <div className="text-xs text-red-700/70 dark:text-red-200/70">
                        Total Expenses
                      </div>
                    </div>

                    <div
                      className={`text-center p-4 rounded-xl ${
                        getNetChange(report) >= 0
                          ? "bg-green-50 dark:bg-green-900/20"
                          : "bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <div
                        className={`text-lg font-bold flex items-center justify-center gap-1 ${getNetChangeColor(
                          report
                        )}`}
                      >
                        <NetChangeIcon className="h-4 w-4" />
                        {formatCurrency(Math.abs(getNetChange(report)))}
                      </div>
                      <div className="text-xs text-emerald-700/70 dark:text-emerald-200/70">
                        Net Change
                      </div>
                    </div>

                    <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(report.closingBalance)}
                      </div>
                      <div className="text-xs text-emerald-700/70 dark:text-emerald-200/70">
                        Closing Balance
                      </div>
                    </div>
                  </div>

                  {report.summary && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10">
                      <p className="text-sm text-emerald-800/80 dark:text-emerald-50/80 whitespace-pre-wrap">
                        {report.summary}
                      </p>
                    </div>
                  )}

                  {report.preparedBy && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-800/60">
                      <div className="text-xs text-emerald-700/70 dark:text-emerald-200/70">
                        Prepared by: {report.preparedBy}
                      </div>
                    </div>
                  )}
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
            Questions About Our Finances?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            We believe in complete transparency. If you have any questions about
            our financial reports, expenses, or how donations are used, we're
            here to help.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Shield className="h-5 w-5" /> Ask Questions
            </Link>
            <Link
              href="/donate"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              Support Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
