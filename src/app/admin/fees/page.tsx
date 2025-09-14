"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  DollarSign,
  Filter,
  Plus,
  UserCheck,
  UserX,
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

type Item = {
  _id: string;
  month: string;
  amount: number;
  status: "unpaid" | "partial" | "paid" | "waived";
  paidAt?: string;
  userId: {
    _id: string;
    name?: string;
    email: string;
    role: "Admin" | "Member" | "User";
  };
};

export default function AdminFeesPage() {
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM
  const [amount, setAmount] = useState<number>(200); // default fee
  const [roles, setRoles] = useState<{ Admin: boolean; Member: boolean }>({
    Admin: false,
    Member: true,
  });

  const [filterMonth, setFilterMonth] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterMonth) params.set("month", filterMonth);
    if (status) params.set("status", status);
    if (role) params.set("role", role);
    const res = await fetch(`/api/admin/fees?${params.toString()}`);
    const json = await res.json();
    if (json.ok) setItems(json.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filterMonth, status, role]);

  const generate = async () => {
    const chosenRoles = Object.entries(roles)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (chosenRoles.length === 0) return alert("Select at least one role");

    setGenerating(true);
    const res = await fetch("/api/admin/fees/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, amount, roles: chosenRoles }),
    });
    const json = await res.json();
    if (json.ok) {
      alert(`Created: ${json.created} fees for ${json.month}`);
      setFilterMonth(month);
      load();
    } else {
      alert(json.error || "Failed to generate");
    }
    setGenerating(false);
  };

  const mark = async (id: string, status: Item["status"]) => {
    const res = await fetch(`/api/admin/fees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.ok) load();
    else alert(json.error || "Failed to update");
  };

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    items.forEach((item) => {
      if (item.status === "paid") {
        const monthKey = item.month;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + item.amount;
      }
    });
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount,
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

  const roleData = useMemo(() => {
    const roleCounts: { [key: string]: number } = {};
    items.forEach((item) => {
      roleCounts[item.userId.role] = (roleCounts[item.userId.role] || 0) + 1;
    });
    return Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
    }));
  }, [items]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "partial":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "unpaid":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "waived":
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Loader2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "partial":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "unpaid":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "waived":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const totalCollected = items
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPending = items
    .filter((item) => item.status === "unpaid")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section id="fees-hero" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <CreditCard className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
            Monthly Fees Management
          </h1>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
            Track and manage monthly membership fees for all members
          </p>
        </motion.div>
      </Section>

      {/* Stats Section */}
      <Section id="fees-stats" className="py-8">
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
              {totalCollected.toLocaleString()} BDT
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Total Collected
            </div>
          </div>

          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6 text-center">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-800/40 w-fit mx-auto mb-4">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              {totalPending.toLocaleString()} BDT
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Pending Collection
            </div>
          </div>

          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6 text-center">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800/40 w-fit mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              {items.length}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Total Fees
            </div>
          </div>

          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6 text-center">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-800/40 w-fit mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              {items.filter((item) => item.status === "paid").length}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              Paid Fees
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Generate Fees Section */}
      <Section id="generate-fees" className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
              Generate Monthly Fees
            </h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Month
              </label>
              <input
                type="month"
                className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Amount (BDT)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Target Roles
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    checked={roles.Member}
                    onChange={(e) =>
                      setRoles((r) => ({ ...r, Member: e.target.checked }))
                    }
                  />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    Members
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    checked={roles.Admin}
                    onChange={(e) =>
                      setRoles((r) => ({ ...r, Admin: e.target.checked }))
                    }
                  />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    Admins
                  </span>
                </label>
              </div>
            </div>
            <div className="flex items-end">
              <button
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                onClick={generate}
                disabled={generating}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Charts Section */}
      <Section id="fees-charts" className="py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Monthly Collection Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-6">
              Monthly Collection
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

          {/* Role Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-6">
              Role Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="count"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ role, count }) => `${role}: ${count}`}
                  >
                    {roleData.map((entry, index) => (
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
              Filter Fees
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Month
              </label>
              <input
                type="month"
                className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="waived">Waived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">All</option>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Fees Table */}
      <Section id="fees-table" className="py-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16"
          >
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <p className="text-emerald-700 dark:text-emerald-300">
                Loading fees...
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
              <CreditCard className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                No fees found
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300">
                Try adjusting your filters or generate new fees.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-emerald-200 dark:border-emerald-800">
              <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                All Fees ({items.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50 dark:bg-emerald-800/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Paid At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Actions
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
                        {item.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900 dark:text-emerald-100">
                        <div>
                          <div className="font-medium">
                            {item.userId?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400">
                            {item.userId?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700 dark:text-emerald-300">
                        <div className="flex items-center gap-2">
                          {item.userId.role === "Admin" ? (
                            <UserCheck className="h-4 w-4 text-purple-500" />
                          ) : (
                            <Users className="h-4 w-4 text-blue-500" />
                          )}
                          {item.userId.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        {item.amount.toLocaleString()} BDT
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700 dark:text-emerald-300">
                        {item.paidAt
                          ? new Date(item.paidAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-1">
                          <button
                            className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                            onClick={() => mark(item._id, "unpaid")}
                          >
                            Unpaid
                          </button>
                          <button
                            className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 rounded transition-colors"
                            onClick={() => mark(item._id, "partial")}
                          >
                            Partial
                          </button>
                          <button
                            className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                            onClick={() => mark(item._id, "paid")}
                          >
                            Paid
                          </button>
                          <button
                            className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                            onClick={() => mark(item._id, "waived")}
                          >
                            Waived
                          </button>
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
