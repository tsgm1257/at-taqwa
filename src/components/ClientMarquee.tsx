"use client";

import dynamic from "next/dynamic";

const Marquee = dynamic(() => import("@/components/Marquee"), { ssr: false });

export default function ClientMarquee() {
  return <Marquee />;
}
