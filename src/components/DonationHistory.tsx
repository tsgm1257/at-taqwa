"use client";

import React from "react";
import { motion } from "framer-motion";
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
  LineChart,
  Line,
} from "recharts";
import { DollarSign, TrendingUp, Calendar, Target } from "lucide-react";

type DonationData = {
  _id: string;
  amount: number;
  projectSlug?: string;
  projectTitle?: string;
  method: string;
  status: string;
  createdAt: string;
};

type DonationHistoryProps = {
  donations: DonationData[];
  loading?: boolean;
};

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function DonationHistory({
  donations,
  loading = false,
}: DonationHistoryProps) {
  // Process data for charts
  const monthlyData = React.useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};

    donations.forEach((donation) => {
      const month = new Date(donation.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + donation.amount;
    });

    return Object.entries(monthlyTotals)
      .map(([month, amount]) => ({ month, amount }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );
  }, [donations]);

  const projectData = React.useMemo(() => {
    const projectTotals: { [key: string]: number } = {};

    donations.forEach((donation) => {
      const project = donation.projectTitle || "General";
      projectTotals[project] = (projectTotals[project] || 0) + donation.amount;
    });

    return Object.entries(projectTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [donations]);

  const methodData = React.useMemo(() => {
    const methodTotals: { [key: string]: number } = {};

    donations.forEach((donation) => {
      methodTotals[donation.method] =
        (methodTotals[donation.method] || 0) + donation.amount;
    });

    return Object.entries(methodTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [donations]);

  const totalDonated = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );
  const totalDonations = donations.length;
  const averageDonation =
    totalDonations > 0 ? totalDonated / totalDonations : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-emerald-200 dark:bg-emerald-800 rounded mb-4"></div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-emerald-200 dark:bg-emerald-800 rounded-xl"
              ></div>
            ))}
          </div>
          <div className="h-80 bg-emerald-200 dark:bg-emerald-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
          No Donations Yet
        </h3>
        <p className="text-emerald-700/70 dark:text-emerald-200/70">
          Your donation history will appear here once you make your first
          contribution.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          Donation History
        </h3>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid md:grid-cols-3 gap-4 mb-6"
      >
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {formatCurrency(totalDonated)}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
            Total Donated
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {totalDonations}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
            Total Donations
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {formatCurrency(averageDonation)}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
            Average Donation
          </div>
        </div>
      </motion.div>

      {/* Monthly Donations Chart */}
      {monthlyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6"
        >
          <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Monthly Donations
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `৳${value}`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Amount",
                  ]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Donations Pie Chart */}
        {projectData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6"
          >
            <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              Donations by Project
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Amount",
                    ]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Payment Method Pie Chart */}
        {methodData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6"
          >
            <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Payment Methods
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {methodData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Amount",
                    ]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
