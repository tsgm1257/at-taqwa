import React from "react";
import Section from "./Section";
import { Megaphone } from "lucide-react";

export default function AnnouncementMarquee() {
  const [announcements, setAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMarqueeAnnouncements = async () => {
      try {
        const response = await fetch(
          "/api/announcements?marquee=1&scope=public"
        );
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch marquee announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarqueeAnnouncements();
  }, []);

  // Don't render if loading or no announcements
  if (loading || announcements.length === 0) {
    return null;
  }

  return (
    <div
      id="announcements"
      className="sticky top-[60px] z-40 border-b border-emerald-200/60 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-900/20 backdrop-blur-sm"
    >
      <Section className="py-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <Megaphone className="h-4 w-4 shrink-0" />
          <div className="relative w-full">
            <div className="animate-[marquee_22s_linear_infinite] whitespace-nowrap">
              {announcements.map((a) => (
                <span key={a._id} className="mr-10 text-sm">
                  • {a.body}
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
