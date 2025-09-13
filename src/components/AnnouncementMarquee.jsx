import React from "react";
import Section from "./Section";
import { Megaphone } from "lucide-react";

const announcements = [
  {
    id: 1,
    text: "Community Iftar & Fundraiser — Friday 7:00 PM at Union Hall",
  },
  {
    id: 2,
    text: "Flood relief volunteers orientation — Sat 10:30 AM (Office)",
  },
  {
    id: 3,
    text: "Zakat desk now open: Guidance & distribution policy available.",
  },
];

export default function AnnouncementMarquee() {
  return (
    <div
      id="announcements"
      className="border-b border-emerald-200/60 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-900/20"
    >
      <Section className="py-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <Megaphone className="h-4 w-4 shrink-0" />
          <div className="relative w-full">
            <div className="animate-[marquee_22s_linear_infinite] whitespace-nowrap">
              {announcements.map((a) => (
                <span key={a.id} className="mr-10 text-sm">
                  • {a.text}
                </span>
              ))}
            </div>
            <style>{`@keyframes marquee {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
          </div>
        </div>
      </Section>
    </div>
  );
}
