"use client";

import { useEffect, useState } from "react";

type Item = {
  _id: string;
  month: string;
  amount: number;
  status: "unpaid" | "partial" | "paid" | "waived";
  paidAt?: string;
  userId: { _id: string; name?: string; email: string; role: "Admin" | "Member" | "User" };
};

export default function AdminFeesPage() {
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [amount, setAmount] = useState<number>(200); // default fee
  const [roles, setRoles] = useState<{ Admin: boolean; Member: boolean }>({ Admin: false, Member: true });

  const [filterMonth, setFilterMonth] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { load(); }, [filterMonth, status, role]);

  const generate = async () => {
    const chosenRoles = Object.entries(roles).filter(([, v]) => v).map(([k]) => k);
    if (chosenRoles.length === 0) return alert("Select at least one role");

    const res = await fetch("/api/admin/fees/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, amount, roles: chosenRoles }),
    });
    const json = await res.json();
    if (json.ok) {
      alert(`Created: ${json.created} fees for ${json.month}`);
      setFilterMonth(month);
    } else {
      alert(json.error || "Failed to generate");
    }
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Fees — Admin</h1>

      {/* Generate */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Generate Monthly Fees</h2>
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <label className="label"><span className="label-text">Month</span></label>
              <input type="month" className="input input-bordered w-full" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
            <div>
              <label className="label"><span className="label-text">Amount (BDT)</span></label>
              <input type="number" className="input input-bordered w-full" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <div className="flex items-end gap-3">
              <label className="label cursor-pointer">
                <span className="label-text mr-2">Members</span>
                <input type="checkbox" className="checkbox" checked={roles.Member} onChange={(e) => setRoles(r => ({ ...r, Member: e.target.checked }))} />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text mr-2">Admins</span>
                <input type="checkbox" className="checkbox" checked={roles.Admin} onChange={(e) => setRoles(r => ({ ...r, Admin: e.target.checked }))} />
              </label>
            </div>
            <div className="flex items-end">
              <button className="btn btn-primary w-full" onClick={generate}>Generate</button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="label"><span className="label-text">Filter month</span></label>
          <input type="month" className="input input-bordered" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
        </div>
        <div>
          <label className="label"><span className="label-text">Status</span></label>
          <select className="select select-bordered" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="waived">Waived</option>
          </select>
        </div>
        <div>
          <label className="label"><span className="label-text">Role</span></label>
          <select className="select select-bordered" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All</option>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>User</th>
                <th>Role</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f._id}>
                  <td>{f.month}</td>
                  <td>{f.userId?.name || "-"}<div className="text-xs opacity-70">{f.userId?.email}</div></td>
                  <td>{f.userId?.role}</td>
                  <td>{f.amount}</td>
                  <td>{f.status}</td>
                  <td>{f.paidAt ? new Date(f.paidAt).toLocaleDateString() : "-"}</td>
                  <td className="space-x-2">
                    <button className="btn btn-xs" onClick={() => mark(f._id, "unpaid")}>Unpaid</button>
                    <button className="btn btn-xs btn-warning" onClick={() => mark(f._id, "partial")}>Partial</button>
                    <button className="btn btn-xs btn-success" onClick={() => mark(f._id, "paid")}>Paid</button>
                    <button className="btn btn-xs btn-info" onClick={() => mark(f._id, "waived")}>Waived</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7}>No records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
