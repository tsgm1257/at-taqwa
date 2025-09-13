"use client";

import { useEffect, useState } from "react";

type Item = {
  _id: string;
  amount: number;
  currency: string;
  method: "sslcommerz"|"bkash"|"nagad"|"cash";
  status: "initiated"|"pending"|"succeeded"|"failed"|"refunded";
  createdAt: string;
  projectId?: { title: string; slug: string };
};

export default function MemberDonationsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/member/donations", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) {
      setItems(json.items);
      setTotal(json.totals.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold">My Donations</h1>
      <div className="stats shadow mt-6">
        <div className="stat">
          <div className="stat-title">Total Succeeded</div>
          <div className="stat-value">{total} BDT</div>
        </div>
      </div>

      {loading ? (
        <div className="mt-6">Loading...</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map(d => (
                <tr key={d._id}>
                  <td>{new Date(d.createdAt).toLocaleString()}</td>
                  <td>{d.projectId?.title || "-"}</td>
                  <td>{d.amount} {d.currency}</td>
                  <td>{d.method}</td>
                  <td>{d.status}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5}>No donations yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
