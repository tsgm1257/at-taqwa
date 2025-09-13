"use client";

import { useState } from "react";

export default function DonateButton({ projectSlug }: { projectSlug?: string }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(200);
  const [method, setMethod] = useState<"sslcommerz"|"bkash"|"nagad">("sslcommerz");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/donations/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method, projectSlug }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(typeof json.error === "string" ? json.error : "Failed");
      setMsg(`Donation created. ID: ${json.id}. Gateway integration coming soon.`);
      // Later: window.location.href = json.redirectUrl
    } catch (e) {
      if (e instanceof Error) {
        setMsg(e.message || "Failed to start donation");
      } else {
        setMsg("Failed to start donation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>Donate</button>

      {open && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Donate</h3>
            <div className="mt-4 space-y-3">
              <label className="form-control">
                <span className="label-text">Amount (BDT)</span>
                <input type="number" className="input input-bordered"
                  value={amount} min={1} onChange={e => setAmount(Number(e.target.value))} />
              </label>
              <label className="form-control">
                <span className="label-text">Method</span>
                <select
                  className="select select-bordered"
                  value={method}
                  onChange={e =>
                    setMethod(
                      e.target.value as "sslcommerz" | "bkash" | "nagad"
                    )
                  }
                >
                  <option value="sslcommerz">SSLCommerz</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                </select>
              </label>
              {msg && <div className="alert mt-2">{msg}</div>}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setOpen(false)}>Close</button>
              <button className="btn btn-primary" onClick={start} disabled={loading}>
                {loading ? "Starting..." : "Proceed"}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setOpen(false)}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
