import React from 'react';

export default function QuickDonate() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {[10, 25, 50, 100].map((amt) => (
        <button
          key={amt}
          className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/60 dark:bg-emerald-900/20 px-4 py-2 text-sm font-semibold hover:shadow-md transition"
        >
          ${amt}
        </button>
      ))}
      <button className="col-span-2 sm:col-span-2 rounded-xl border border-emerald-300/60 bg-emerald-500 text-white px-4 py-2 font-semibold hover:bg-emerald-600 transition">
        Give Now
      </button>
      <button className="col-span-2 sm:col-span-2 rounded-xl border border-yellow-300/60 bg-yellow-400/90 text-emerald-950 px-4 py-2 font-semibold hover:bg-yellow-500 transition">
        Zakat / Sadaqah
      </button>
    </div>
  );
}
