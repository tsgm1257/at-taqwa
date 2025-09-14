"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  X,
  Save,
  Download,
  Filter,
  Search,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";

type ListRow = {
  _id: string;
  title: string;
  month: string;
  published: boolean;
  createdAt: string;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
};

type LineItem = { category: string; amount: number; note?: string };

type ReportDetail = {
  _id: string;
  title: string;
  month: string;
  currency: string;
  openingBalance: number;
  income: LineItem[];
  expense: LineItem[];
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  summary?: string;
  published: boolean;
};

export default function AdminReportsPage() {
  // Generate from DB
  const [genMonth, setGenMonth] = React.useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM
  const [opening, setOpening] = React.useState<number>(0);
  const [overwrite, setOverwrite] = React.useState<boolean>(true);
  const [genBusy, setGenBusy] = React.useState(false);

  // List filters
  const [year, setYear] = React.useState<string>(
    new Date().getFullYear().toString()
  );
  const [q, setQ] = React.useState<string>("");
  const [published, setPublished] = React.useState<"all" | "true" | "false">(
    "all"
  );

  // List data
  const [items, setItems] = React.useState<ListRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Edit modal
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<ReportDetail | null>(null);
  const [saving, setSaving] = React.useState(false);

  const loadList = async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (year) qs.set("year", year);
    if (q) qs.set("q", q);
    if (published) qs.set("published", published);
    const res = await fetch(`/api/admin/reports?${qs.toString()}`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.ok) setItems(json.items);
    setLoading(false);
  };

  React.useEffect(() => {
    loadList(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [year, q, published]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenBusy(true);
    const res = await fetch("/api/admin/reports/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: genMonth,
        openingBalance: opening,
        overwrite,
      }),
    });
    const json = await res.json();
    setGenBusy(false);
    if (json.ok) {
      alert(
        `Generated ${genMonth}. Income: ${json.item.totalIncome}, Closing: ${json.item.closingBalance}`
      );
      setYear(genMonth.slice(0, 4)); // show in list
      loadList();
    } else {
      alert(json.error || "Failed to generate");
    }
  };

  const openEdit = async (id: string) => {
    const res = await fetch(`/api/admin/reports/${id}`);
    const json = await res.json();
    if (json.ok) {
      setDetail(json.item);
      setEditingId(id);
    } else {
      alert(json.error || "Failed to load report");
    }
  };

  const addExpense = () => {
    if (!detail) return;
    setDetail({
      ...detail,
      expense: [...detail.expense, { category: "", amount: 0 }],
    });
  };

  const updateExpense = (idx: number, patch: Partial<LineItem>) => {
    if (!detail) return;
    const arr = [...detail.expense];
    arr[idx] = { ...arr[idx], ...patch };
    setDetail({ ...detail, expense: arr });
  };

  const removeExpense = (idx: number) => {
    if (!detail) return;
    const arr = detail.expense.filter((_, i) => i !== idx);
    setDetail({ ...detail, expense: arr });
  };

  const saveEdit = async () => {
    if (!editingId || !detail) return;
    setSaving(true);
    const res = await fetch(`/api/admin/reports/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        openingBalance: detail.openingBalance,
        summary: detail.summary || "",
        published: detail.published,
        expense: detail.expense.map((e) => ({
          category: e.category,
          amount: Number(e.amount) || 0,
          note: e.note || "",
        })),
        // We intentionally do NOT patch income here; it's generated from DB.
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.ok) {
      alert("Saved.");
      setEditingId(null);
      setDetail(null);
      loadList();
    } else {
      alert(json.error || "Save failed");
    }
  };

  const togglePublish = async (id: string, next: boolean) => {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
    const json = await res.json();
    if (json.ok) loadList();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this report?")) return;
    const res = await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) loadList();
  };

  // Calculate summary statistics
  const totalReports = items.length;
  const publishedReports = items.filter((r) => r.published).length;
  const totalIncome = items.reduce((sum, r) => sum + r.totalIncome, 0);
  const totalExpense = items.reduce((sum, r) => sum + r.totalExpense, 0);
  const netBalance = totalIncome - totalExpense;

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
              Financial Reports Management
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Manage <span className="text-emerald-600">Financial Reports</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Generate, edit, and manage monthly financial reports. Track
              income, expenses, and maintain transparency in your
              organization&apos;s finances.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <FileText className="h-4 w-4" />
                <span>Monthly Reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <BarChart3 className="h-4 w-4" />
                <span>Financial Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <CheckCircle className="h-4 w-4" />
                <span>Transparency</span>
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
              {totalReports}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Reports
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {publishedReports}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Published
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalIncome)}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Total Income
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4 text-center"
          >
            <div
              className={`text-2xl font-bold ${
                netBalance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(netBalance)}
            </div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              Net Balance
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Generate Report Form */}
      <Section id="generate" className="py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6"
        >
          <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600" />
            Generate New Report
          </h2>

          <form onSubmit={generate} className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Month
                </label>
                <input
                  type="month"
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={genMonth}
                  onChange={(e) => setGenMonth(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Opening Balance (BDT)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={opening}
                  onChange={(e) => setOpening(Number(e.target.value))}
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={overwrite}
                    onChange={(e) => setOverwrite(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    Overwrite income
                  </span>
                </label>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={genBusy}
                >
                  {genBusy ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
              This pulls <strong>Donations (succeeded)</strong> within the month
              and <strong>Fees (paid/partial via paidAmount)</strong>, and fills
              the income lines. You can add/edit <strong>expense</strong> items
              below.
            </p>
          </form>
        </motion.div>
      </Section>

      {/* Filters */}
      <Section id="filters" className="py-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Filters</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Year
            </label>
            <input
              className="w-28 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
              <input
                className="pl-10 pr-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Title/category"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Published
            </label>
            <select
              className="px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={published}
              onChange={(e) =>
                setPublished(e.target.value as "all" | "true" | "false")
              }
            >
              <option value="all">All</option>
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
          </div>
        </motion.div>
      </Section>

      {/* Reports List */}
      <Section id="reports" className="py-10">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 animate-pulse"
              >
                <div className="h-6 w-1/4 bg-emerald-200 dark:bg-emerald-800 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              No Reports Found
            </h3>
            <p className="text-emerald-700/70 dark:text-emerald-200/70">
              Generate your first financial report to start tracking your
              organization&apos;s finances.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                        {report.month}
                      </span>
                    </div>
                    {report.published && (
                      <span className="text-xs rounded-full px-2 py-1 font-medium bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Published
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(report._id)}
                      className="rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-4 py-2 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition inline-flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <a
                      href={`/reports/${report.month}`}
                      target="_blank"
                      className="rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-4 py-2 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition inline-flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </a>
                    <button
                      onClick={() => remove(report._id)}
                      className="rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition inline-flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70 mb-1">
                      Income
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(report.totalIncome)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70 mb-1">
                      Expense
                    </div>
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(report.totalExpense)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70 mb-1">
                      Closing Balance
                    </div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(report.closingBalance)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70 mb-1">
                      Created
                    </div>
                    <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    {report.title}
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={report.published}
                      onChange={(e) =>
                        togglePublish(report._id, e.target.checked)
                      }
                    />
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      Published
                    </span>
                  </label>
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
            Need Help Managing Reports?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Generate comprehensive financial reports, track income and expenses,
            and maintain transparency in your organization&apos;s financial
            activities.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("generate")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> Generate Report
            </button>
            <a
              href="/reports"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              View Public Reports <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>

      {/* Edit Modal */}
      {editingId && detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                Edit Report — {detail.month}
              </h2>
              <button
                onClick={() => {
                  setEditingId(null);
                  setDetail(null);
                }}
                className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-lg transition"
              >
                <X className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Opening Balance
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={detail.openingBalance}
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      openingBalance: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={detail.published}
                  onChange={(e) =>
                    setDetail({ ...detail, published: e.target.checked })
                  }
                />
                <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Published
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Summary (optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                  value={detail.summary || ""}
                  onChange={(e) =>
                    setDetail({ ...detail, summary: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  Expenses
                </h4>
                <button
                  onClick={addExpense}
                  className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700 transition inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Expense
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-emerald-200 dark:border-emerald-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        Note
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.expense.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-emerald-100 dark:border-emerald-800/50"
                      >
                        <td className="py-3 px-4">
                          <input
                            className="w-full px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={row.category}
                            onChange={(e) =>
                              updateExpense(idx, { category: e.target.value })
                            }
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            className="w-full px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={row.amount}
                            onChange={(e) =>
                              updateExpense(idx, {
                                amount: Number(e.target.value),
                              })
                            }
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            className="w-full px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={row.note || ""}
                            onChange={(e) =>
                              updateExpense(idx, { note: e.target.value })
                            }
                          />
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => removeExpense(idx)}
                            className="rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition inline-flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {detail.expense.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 px-4 text-center text-emerald-700/70 dark:text-emerald-200/70"
                        >
                          No expense items. Add some to track your
                          organization&apos;s expenses.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setDetail(null);
                }}
                className="px-6 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
