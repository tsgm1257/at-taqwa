"use client";

import { useEffect, useState } from "react";

/**
 * Simple marquee that scrolls announcements horizontally.
 * Fetches public marquee items from /api/announcements?marquee=1
 */
export default function Marquee() {
  const [items, setItems] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/announcements?marquee=1", { cache: "no-store" });
        const json = await res.json();
        if (json?.ok) setItems(json.items || []);
      } catch {}
    };
    load();
    // Re-fetch every 5 minutes (optional)
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!items.length) return null;

  return (
    <div className="w-full bg-base-200 border-y border-base-300">
      <div className="relative overflow-hidden">
        <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap py-2">
          {items.map((a, i) => (
            <span key={a._id} className="mx-6">
              {a.title}
              {i !== items.length - 1 && <span className="opacity-60 mx-6">•</span>}
            </span>
          ))}
        </div>
      </div>
      {/* Tailwind keyframes defined via inline style in globals.css below */}
    </div>
  );
}
