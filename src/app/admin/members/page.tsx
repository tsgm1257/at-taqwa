"use client";

import { useEffect, useState } from "react";

type Req = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
};

export default function AdminMembersPage() {
  const [items, setItems] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"pending" | "approved" | "denied">("pending");

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/membership-requests?status=${status}`);
    const json = await res.json();
    if (json.ok) setItems(json.items);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable react-hooks/exhaustive-deps */ }, [status]);

  const act = async (id: string, action: "approve" | "deny") => {
    const res = await fetch(`/api/admin/membership-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const json = await res.json();
    if (json.ok) load();
    else alert(json.error || "Action failed");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Membership Requests</h1>
        <select className="select select-bordered" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-6">Loading...</div>
      ) : items.length === 0 ? (
        <div className="mt-6 alert">No requests</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Notes</th>
                <th>Submitted</th>
                {status === "pending" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r._id}>
                  <td className="font-medium">{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.phone || "-"}</td>
                  <td className="max-w-xs truncate" title={r.notes || ""}>{r.notes || "-"}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  {status === "pending" && (
                    <td className="space-x-2">
                      <button className="btn btn-xs btn-success" onClick={() => act(r._id, "approve")}>
                        Approve
                      </button>
                      <button className="btn btn-xs btn-error" onClick={() => act(r._id, "deny")}>
                        Deny
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
