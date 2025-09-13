import React from "react";

export default function ProgressBar({ value = 0 }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden">
      <div
        className="h-full bg-emerald-500 dark:bg-emerald-400"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
