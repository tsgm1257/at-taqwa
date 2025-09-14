"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Users,
  Filter,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";

type Row = {
  _id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  createdAt: string;
  userId?: { name?: string; email: string; role: string };
  projectId?: { title: string; slug: string };
};

export default function AdminDonationsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [email, setEmail] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    if (method) qs.set("method", method);
    if (email) qs.set("email", email);
    if (projectSlug) qs.set("projectSlug", projectSlug);
    const res = await fetch(`/api/admin/donations?${qs.toString()}`);
    const json = await res.json();
    if (json.ok) setItems(json.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status, method, email, projectSlug]);

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    items.forEach((item) => {
      if (item.status === "succeeded") {
        const month = new Date(item.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
        monthlyData[month] = (monthlyData[month] || 0) + item.amount;
      }
    });
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [items]);

  const methodData = useMemo(() => {
    const methodCounts: { [key: string]: number } = {};
    items.forEach((item) => {
      if (item.status === "succeeded") {
        methodCounts[item.method] = (methodCounts[item.method] || 0) + 1;
      }
    });
    return Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count,
    }));
  }, [items]);

  const statusData = useMemo(() => {
    const statusCounts: { [key: string]: number } = {};
    items.forEach((item) => {
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [items]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const totalAmount = items
    .filter((item) => item.status === "succeeded")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section id="donations-hero" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
            Donation Management
          </h1>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
            Monitor and manage all donations from community members and
            supporters
          </p>
        </motion.div>
      </Section>

      {/* Stats Section */}
      <Section id="donation-stats" className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6 text-center">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-800/40 w-fit mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              {totalAmount.toLocaleString()} BDT
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Total Raised
            </div>
          </div>

          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6 text-center">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800/40 w-fit mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              {items.filter((item) => item.status === "succeeded").length}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Successful Donations
            </div>
          </div>

          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6 text-center">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-800/40 w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              {new Set(items.map((item) => item.userId?.email)).size}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Unique Donors
            </div>
          </div>

          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6 text-center">
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-800/40 w-fit mx-auto mb-4">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              {items.length}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Total Transactions
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Charts Section */}
      <Section id="donation-charts" className="py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Monthly Donations Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-6">
              Monthly Donations
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Payment Methods Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-6">
              Payment Methods
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodData}
                    dataKey="count"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ method, count }: any) => `${method}: ${count}`}
                  >
                    {methodData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Status Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-6">
              Status Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Filters Section */}
      <Section id="filters" className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
              Filter Donations
            </h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="initiated">Initiated</option>
                <option value="pending">Pending</option>
                <option value="succeeded">Succeeded</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Payment Method
              </label>
              <select
                className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="">All methods</option>
                <option value="sslcommerz">SSLCommerz</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Donor Email
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Filter by donor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Project Slug
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Filter by project slug"
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Donations Table */}
      <Section id="donations-table" className="py-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16"
          >
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <p className="text-emerald-700 dark:text-emerald-300">
                Loading donations...
              </p>
            </div>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-emerald-900 shadow-lg max-w-md mx-auto">
              <DollarSign className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                No donations found
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300">
                Try adjusting your filters to see more results.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-emerald-200 dark:border-emerald-800">
              <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                All Donations ({items.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50 dark:bg-emerald-800/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-200 dark:divide-emerald-800">
                  {items.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-emerald-50 dark:hover:bg-emerald-800/20"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900 dark:text-emerald-100">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900 dark:text-emerald-100">
                        <div>
                          <div className="font-medium">
                            {item.userId?.name || "Anonymous"}
                          </div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400">
                            {item.userId?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900 dark:text-emerald-100">
                        {item.projectId?.title || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        {item.amount.toLocaleString()} {item.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700 dark:text-emerald-300">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {item.method}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusIcon(item.status)}
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </Section>
    </div>
  );
}
