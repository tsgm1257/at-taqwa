"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Fee = {
  _id: string;
  month: string; // "YYYY-MM"
  amount: number;
  status: "unpaid" | "partial" | "paid" | "waived";
  paidAt?: string;
};

export default function MemberFeesPage() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [items, setItems] = useState<Fee[]>([]);
  const [totals, setTotals] = useState<{ amount: number; due: number }>({
    amount: 0,
    due: 0,
  });
  const [loading, setLoading] = useState(true);

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

  const chartData = useMemo(() => {
    return items.map((f) => ({
      month: f.month.slice(5), // "MM"
      amount: f.amount,
      status: f.status,
    }));
  }, [items]);

  const badge = (s: Fee["status"]) =>
    s === "paid"
      ? "badge-success"
      : s === "partial"
      ? "badge-warning"
      : s === "waived"
      ? "badge-info"
      : "badge-error";

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
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                {items.map((f) => (
                  <tr key={f._id}>
                    <td>{f.month}</td>
                    <td>{f.amount}</td>
                    <td>
                      <span className={`badge ${badge(f.status)}`}>
                        {f.status}
                      </span>
                    </td>
                    <td>
                      {f.paidAt ? new Date(f.paidAt).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4}>No fees created for this year.</td>
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
