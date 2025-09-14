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
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

type FeeData = {
  _id: string;
  amount: number;
  month: string;
  year: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paidDate?: string;
  createdAt: string;
};

type MonthlyFeesProps = {
  fees: FeeData[];
  loading?: boolean;
};

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function MonthlyFees({
  fees,
  loading = false,
}: MonthlyFeesProps) {
  // Process data for charts
  const monthlyData = React.useMemo(() => {
    const monthlyTotals: {
      [key: string]: { paid: number; pending: number; overdue: number };
    } = {};

    fees.forEach((fee) => {
      const month = `${fee.month} ${fee.year}`;
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { paid: 0, pending: 0, overdue: 0 };
      }
      monthlyTotals[month][fee.status] += fee.amount;
    });

    return Object.entries(monthlyTotals)
      .map(([month, amounts]) => ({
        month,
        paid: amounts.paid,
        pending: amounts.pending,
        overdue: amounts.overdue,
        total: amounts.paid + amounts.pending + amounts.overdue,
      }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );
  }, [fees]);

  const statusData = React.useMemo(() => {
    const statusTotals: { [key: string]: number } = {
      paid: 0,
      pending: 0,
      overdue: 0,
    };

    fees.forEach((fee) => {
      statusTotals[fee.status] += fee.amount;
    });

    return Object.entries(statusTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [fees]);

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = fees
    .filter((fee) => fee.status === "paid")
    .reduce((sum, fee) => sum + fee.amount, 0);
  const pendingFees = fees
    .filter((fee) => fee.status === "pending")
    .reduce((sum, fee) => sum + fee.amount, 0);
  const overdueFees = fees
    .filter((fee) => fee.status === "overdue")
    .reduce((sum, fee) => sum + fee.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "overdue":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-emerald-200 dark:bg-emerald-800 rounded mb-4"></div>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
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

  if (fees.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
          No Monthly Fees
        </h3>
        <p className="text-emerald-700/70 dark:text-emerald-200/70">
          Your monthly fee history will appear here once fees are generated.
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
          <CreditCard className="h-5 w-5 text-emerald-600" />
          Monthly Fees
        </h3>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid md:grid-cols-4 gap-4 mb-6"
      >
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {formatCurrency(totalFees)}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
            Total Fees
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {formatCurrency(paidFees)}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
            Paid
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
            {formatCurrency(pendingFees)}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
            Pending
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
            {formatCurrency(overdueFees)}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
            Overdue
          </div>
        </div>
      </motion.div>

      {/* Monthly Fees Chart */}
      {monthlyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6"
        >
          <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Monthly Fees Breakdown
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
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "paid"
                      ? "Paid"
                      : name === "pending"
                      ? "Pending"
                      : "Overdue",
                  ]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="paid"
                  stackId="a"
                  fill="#10b981"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="overdue"
                  stackId="a"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Status Pie Chart */}
      {statusData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6"
        >
          <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            Payment Status Overview
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
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
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "paid"
                      ? "Paid"
                      : name === "pending"
                      ? "Pending"
                      : "Overdue",
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

      {/* Recent Fees List */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-6"
      >
        <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
          Recent Fees
        </h4>
        <div className="space-y-3">
          {fees.slice(0, 5).map((fee) => (
            <div
              key={fee._id}
              className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-800/20"
            >
              <div className="flex items-center gap-3">
                <div className={`${getStatusColor(fee.status)}`}>
                  {getStatusIcon(fee.status)}
                </div>
                <div>
                  <div className="font-medium text-emerald-900 dark:text-emerald-100">
                    {fee.month} {fee.year}
                  </div>
                  <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">
                    Due: {new Date(fee.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-emerald-900 dark:text-emerald-100">
                  {formatCurrency(fee.amount)}
                </div>
                <div
                  className={`text-sm capitalize ${getStatusColor(fee.status)}`}
                >
                  {fee.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
