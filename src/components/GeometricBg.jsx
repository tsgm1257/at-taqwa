import React from "react";

export default function GeometricBg() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-[32rem] w-[32rem] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.08) 60%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(234,179,8,0.28) 0%, rgba(234,179,8,0.06) 60%, transparent 70%)",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="geom"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <circle cx="24" cy="24" r="2" fill="currentColor" />
            <path d="M0 24h48M24 0v48" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geom)" />
      </svg>
    </div>
  );
}
