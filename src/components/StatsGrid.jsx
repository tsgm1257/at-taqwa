import React from "react";

export default function StatsGrid({ items = [] }) {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-4"
        >
          <div className="text-2xl font-extrabold">
            {s.value.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-700/70 dark:text-emerald-200/70">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
