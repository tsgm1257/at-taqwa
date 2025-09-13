"use client";

import { useEffect, useState } from "react";

type ListRow = {
  _id: string;
  title: string;
  month: string;
  published: boolean;
  createdAt: string;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
};

type LineItem = { category: string; amount: number; note?: string };

type ReportDetail = {
  _id: string;
  title: string;
  month: string;
  currency: string;
  openingBalance: number;
  income: LineItem[];
  expense: LineItem[];
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  summary?: string;
  published: boolean;
};

export default function AdminReportsPage() {
  // Generate from DB
  const [genMonth, setGenMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM
  const [opening, setOpening] = useState<number>(0);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [genBusy, setGenBusy] = useState(false);

  // List filters
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [q, setQ] = useState<string>("");
  const [published, setPublished] = useState<"all" | "true" | "false">("all");

  // List data
  const [items, setItems] = useState<ListRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [saving, setSaving] = useState(false);

  const loadList = async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (year) qs.set("year", year);
    if (q) qs.set("q", q);
    if (published) qs.set("published", published);
    const res = await fetch(`/api/admin/reports?${qs.toString()}`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.ok) setItems(json.items);
    setLoading(false);
  };

  useEffect(() => {
    loadList(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [year, q, published]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenBusy(true);
    const res = await fetch("/api/admin/reports/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: genMonth,
        openingBalance: opening,
        overwrite,
      }),
    });
    const json = await res.json();
    setGenBusy(false);
    if (json.ok) {
      alert(
        `Generated ${genMonth}. Income: ${json.item.totalIncome}, Closing: ${json.item.closingBalance}`
      );
      setYear(genMonth.slice(0, 4)); // show in list
      loadList();
    } else {
      alert(json.error || "Failed to generate");
    }
  };

  const openEdit = async (id: string) => {
    const res = await fetch(`/api/admin/reports/${id}`);
    const json = await res.json();
    if (json.ok) {
      setDetail(json.item);
      setEditingId(id);
    } else {
      alert(json.error || "Failed to load report");
    }
  };

  const addExpense = () => {
    if (!detail) return;
    setDetail({
      ...detail,
      expense: [...detail.expense, { category: "", amount: 0 }],
    });
  };

  const updateExpense = (idx: number, patch: Partial<LineItem>) => {
    if (!detail) return;
    const arr = [...detail.expense];
    arr[idx] = { ...arr[idx], ...patch };
    setDetail({ ...detail, expense: arr });
  };

  const removeExpense = (idx: number) => {
    if (!detail) return;
    const arr = detail.expense.filter((_, i) => i !== idx);
    setDetail({ ...detail, expense: arr });
  };

  const saveEdit = async () => {
    if (!editingId || !detail) return;
    setSaving(true);
    const res = await fetch(`/api/admin/reports/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        openingBalance: detail.openingBalance,
        summary: detail.summary || "",
        published: detail.published,
        expense: detail.expense.map((e) => ({
          category: e.category,
          amount: Number(e.amount) || 0,
          note: e.note || "",
        })),
        // We intentionally do NOT patch income here; it's generated from DB.
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.ok) {
      alert("Saved.");
      setEditingId(null);
      setDetail(null);
      loadList();
    } else {
      alert(json.error || "Save failed");
    }
  };

  const togglePublish = async (id: string, next: boolean) => {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
    const json = await res.json();
    if (json.ok) loadList();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this report?")) return;
    const res = await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) loadList();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Reports — Admin</h1>

      {/* Generate from DB */}
      <form onSubmit={generate} className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Generate from Donations & Fees</h2>
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <label className="label">
                <span className="label-text">Month</span>
              </label>
              <input
                type="month"
                className="input input-bordered w-full"
                value={genMonth}
                onChange={(e) => setGenMonth(e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Opening Balance (BDT)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={opening}
                onChange={(e) => setOpening(Number(e.target.value))}
              />
            </div>
            <div className="flex items-end gap-3">
              <label className="label cursor-pointer">
                <span className="label-text mr-2">Overwrite income</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={overwrite}
                  onChange={(e) => setOverwrite(e.target.checked)}
                />
              </label>
            </div>
            <div className="flex items-end">
              <button className="btn btn-primary w-full" disabled={genBusy}>
                {genBusy ? "Generating…" : "Generate"}
              </button>
            </div>
          </div>
          <p className="text-sm opacity-70 mt-2">
            This pulls **Donations (succeeded)** within the month and **Fees
            (paid/partial via paidAmount)**, and fills the income lines. You can
            add/edit <b>expense</b> items below.
          </p>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="label">
            <span className="label-text">Year</span>
          </label>
          <input
            className="input input-bordered w-28"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Search</span>
          </label>
          <input
            className="input input-bordered"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title/category"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Published</span>
          </label>
          <select
            className="select select-bordered"
            value={published}
            onChange={(e) =>
              setPublished(e.target.value as "all" | "true" | "false")
            }
          >
            <option value="all">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Title</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Closing</th>
                <th>Published</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r._id}>
                  <td>{r.month}</td>
                  <td>{r.title}</td>
                  <td>
                    {r.totalIncome} {r.currency}
                  </td>
                  <td>
                    {r.totalExpense} {r.currency}
                  </td>
                  <td>
                    {r.closingBalance} {r.currency}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={r.published}
                      onChange={(e) => togglePublish(r._id, e.target.checked)}
                    />
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-xs"
                      onClick={() => openEdit(r._id)}
                    >
                      Edit
                    </button>
                    <a
                      className="btn btn-xs"
                      href={`/reports/${r.month}`}
                      target="_blank"
                    >
                      View
                    </a>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => remove(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8}>No reports</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && detail && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">Edit Report — {detail.month}</h3>

            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <label className="form-control">
                <span className="label-text">Opening Balance</span>
                <input
                  type="number"
                  className="input input-bordered"
                  value={detail.openingBalance}
                  onChange={(e) =>
                    setDetail({
                      ...detail,
                      openingBalance: Number(e.target.value),
                    })
                  }
                />
              </label>

              <label className="label cursor-pointer">
                <span className="label-text mr-2">Published</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={detail.published}
                  onChange={(e) =>
                    setDetail({ ...detail, published: e.target.checked })
                  }
                />
              </label>

              <div className="md:col-span-2">
                <span className="label-text">Summary (optional)</span>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={detail.summary || ""}
                  onChange={(e) =>
                    setDetail({ ...detail, summary: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Expenses</h4>
                <button className="btn btn-sm" onClick={addExpense}>
                  Add row
                </button>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "40%" }}>Category</th>
                      <th style={{ width: "20%" }}>Amount</th>
                      <th style={{ width: "30%" }}>Note</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.expense.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            className="input input-bordered w-full"
                            value={row.category}
                            onChange={(e) =>
                              updateExpense(idx, { category: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="input input-bordered w-full"
                            value={row.amount}
                            onChange={(e) =>
                              updateExpense(idx, {
                                amount: Number(e.target.value),
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="input input-bordered w-full"
                            value={row.note || ""}
                            onChange={(e) =>
                              updateExpense(idx, { note: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-xs btn-error"
                            onClick={() => removeExpense(idx)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {detail.expense.length === 0 && (
                      <tr>
                        <td colSpan={4}>No expense items. Add some.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setEditingId(null);
                  setDetail(null);
                }}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={saveEdit}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => {
              setEditingId(null);
              setDetail(null);
            }}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
