"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

type ApiEvent = {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
};

import { enUS } from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function EventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    // Optionally pass range: ?start=...&end=...
    const res = await fetch("/api/events", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setEvents(json.items || []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const calEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e._id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        resource: e,
      })),
    [events]
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Events Calendar</h1>
      {loading ? (
        <div className="mt-6">Loading…</div>
      ) : (
        <div className="mt-6 bg-base-100 p-3 rounded-xl shadow">
          <Calendar
            localizer={localizer}
            events={calEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            date={date}
            onNavigate={setDate}
            view={view}
            onView={(v) => setView(v)}
            tooltipAccessor={(e) => e?.resource?.description || ""}
            popup
          />
        </div>
      )}
    </div>
  );
}
