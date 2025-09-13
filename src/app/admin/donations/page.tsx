"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => { load(); }, [status, method, email, projectSlug]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Donations — Admin</h1>

      <div className="grid md:grid-cols-4 gap-3 mt-4">
        <select className="select select-bordered" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="initiated">Initiated</option>
          <option value="pending">Pending</option>
          <option value="succeeded">Succeeded</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select className="select select-bordered" value={method} onChange={(e)=>setMethod(e.target.value)}>
          <option value="">All methods</option>
          <option value="sslcommerz">SSLCommerz</option>
          <option value="bkash">bKash</option>
          <option value="nagad">Nagad</option>
          <option value="cash">Cash</option>
        </select>
        <input className="input input-bordered" placeholder="Filter by donor email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input input-bordered" placeholder="Filter by project slug" value={projectSlug} onChange={(e)=>setProjectSlug(e.target.value)} />
      </div>

      {loading ? (
        <div className="mt-6">Loading...</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r._id}>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>
                    {r.userId?.name || "-"}
                    <div className="text-xs opacity-70">{r.userId?.email}</div>
                  </td>
                  <td>{r.projectId?.title || "-"}</td>
                  <td>{r.amount} {r.currency}</td>
                  <td>{r.method}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6}>No donations</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
