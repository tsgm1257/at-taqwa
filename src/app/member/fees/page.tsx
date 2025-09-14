"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";

type Fee = {
  _id: string;
  month: string; // "YYYY-MM"
  amount: number;
  status: "unpaid" | "partial" | "paid" | "waived";
  paidAt?: string;
};

function MemberFeesContent() {
  const searchParams = useSearchParams();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [items, setItems] = useState<Fee[]>([]);
  const [totals, setTotals] = useState<{ amount: number; due: number }>({
    amount: 0,
    due: 0,
  });
  const [loading, setLoading] = useState(true);
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/member/fees?year=${year}`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.ok) {
      setItems(json.items);
      setTotals(json.totals);
    }
    setLoading(false);
  }, [year]);

  useEffect(() => {
    load();
  }, [load]);

  // Handle payment result messages from URL parameters
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const feeId = searchParams.get("feeId");
    const amount = searchParams.get("amount");

    if (success === "payment_completed" && feeId && amount) {
      setMessage({
        type: "success",
        text: `Payment of ${parseFloat(
          amount
        ).toLocaleString()} BDT completed successfully!`,
      });
      // Clear URL parameters
      window.history.replaceState({}, "", window.location.pathname);
      // Reload data to show updated status
      load();
    } else if (success === "already_paid") {
      setMessage({
        type: "success",
        text: "This fee was already paid successfully!",
      });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error === "payment_failed") {
      setMessage({
        type: "error",
        text: "Payment failed. Please try again or contact support.",
      });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error === "payment_cancelled") {
      setMessage({
        type: "error",
        text: "Payment was cancelled. You can try again anytime.",
      });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error === "payment_invalid") {
      setMessage({
        type: "error",
        text: "Payment was not valid. Please try again or contact support.",
      });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error === "invalid_callback") {
      setMessage({
        type: "error",
        text: "Invalid payment callback. Please contact support.",
      });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error === "fee_not_found") {
      setMessage({
        type: "error",
        text: "Fee record not found. Please contact support.",
      });
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Auto-hide message after 5 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, load]);

  const chartData = useMemo(() => {
    return items.map((f) => ({
      month: f.month.slice(5), // "MM"
      amount: f.amount,
      status: f.status,
    }));
  }, [items]);

  const handlePayment = async (feeId: string, amount: number) => {
    setPayingFeeId(feeId);
    try {
      const response = await fetch("/api/member/fees/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feeId,
          amount,
        }),
      });

      const data = await response.json();

      if (data.ok && data.redirectUrl) {
        // Redirect to payment gateway
        window.location.href = data.redirectUrl;
      } else {
        alert(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setPayingFeeId(null);
    }
  };

  const getStatusIcon = (status: Fee["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "partial":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "unpaid":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "waived":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Fee["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "unpaid":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "waived":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">My Monthly Fees</h1>
        <input
          type="number"
          className="input input-bordered w-28"
          value={year}
          min={2000}
          max={2100}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      {/* Payment Result Messages */}
      {message && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-6">Loading...</div>
      ) : (
        <>
          <div className="stats shadow mt-6">
            <div className="stat">
              <div className="stat-title">Total (Selected Year)</div>
              <div className="stat-value">{totals.amount} BDT</div>
            </div>
            <div className="stat">
              <div className="stat-title">Due</div>
              <div className="stat-value text-error">{totals.due} BDT</div>
            </div>
          </div>

          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((f) => (
                  <tr key={f._id}>
                    <td className="font-medium">{f.month}</td>
                    <td className="font-semibold">
                      {f.amount.toLocaleString()} BDT
                    </td>
                    <td>
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          f.status
                        )}`}
                      >
                        {getStatusIcon(f.status)}
                        {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                      </div>
                    </td>
                    <td className="text-gray-600">
                      {f.paidAt ? new Date(f.paidAt).toLocaleDateString() : "-"}
                    </td>
                    <td>
                      {f.status === "unpaid" ? (
                        <button
                          onClick={() => handlePayment(f._id, f.amount)}
                          disabled={payingFeeId === f._id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg transition-colors font-medium text-sm"
                        >
                          {payingFeeId === f._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                          {payingFeeId === f._id ? "Processing..." : "Pay Now"}
                        </button>
                      ) : f.status === "paid" ? (
                        <span className="text-green-600 font-medium text-sm">
                          ✓ Paid
                        </span>
                      ) : f.status === "waived" ? (
                        <span className="text-blue-600 font-medium text-sm">
                          Waived
                        </span>
                      ) : (
                        <span className="text-gray-500 font-medium text-sm">
                          Partial
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No fees created for this year.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function MemberFeesPage() {
  return (
    <Suspense
      fallback={<div className="max-w-5xl mx-auto p-6">Loading...</div>}
    >
      <MemberFeesContent />
    </Suspense>
  );
}
