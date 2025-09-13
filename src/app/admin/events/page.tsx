"use client";

import { useEffect, useState } from "react";

export default function AdminEventsPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
    visibility: "public",
  });

  type EventItem = {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    location: string;
    visibility: string;
    // Add other fields as needed
  };

  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/events", { cache: "no-store" });
    const json = await res.json();
    if (json.ok) setItems(json.items);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.ok) {
      alert("Event created");
      setForm({ title: "", description: "", start: "", end: "", location: "", visibility: "public" });
      load();
    } else {
      alert(json.error || "Failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Events — Admin</h1>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 bg-base-100 p-4 rounded-xl shadow">
        <input className="input input-bordered" placeholder="Title"
          value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
        <input className="input input-bordered" placeholder="Location"
          value={form.location} onChange={(e)=>setForm({...form, location: e.target.value})} />
        <input className="input input-bordered" type="datetime-local" placeholder="Start"
          value={form.start} onChange={(e)=>setForm({...form, start: e.target.value})} />
        <input className="input input-bordered" type="datetime-local" placeholder="End"
          value={form.end} onChange={(e)=>setForm({...form, end: e.target.value})} />
        <select className="select select-bordered"
          value={form.visibility} onChange={(e)=>setForm({...form, visibility: e.target.value})}>
          <option value="public">Public</option>
          <option value="members">Members</option>
          <option value="admins">Admins</option>
        </select>
        <textarea className="textarea textarea-bordered md:col-span-2" placeholder="Description"
          value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})}/>
        <button className="btn btn-primary md:col-span-2">Create Event</button>
      </form>

      <div className="bg-base-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
        {loading ? "Loading…" : items.length === 0 ? "No events" : (
          <ul className="space-y-2">
            {items.map((e, idx) => (
              <li key={e.title + e.start + idx} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-sm opacity-70">
                    {new Date(e.start).toLocaleString()} → {new Date(e.end).toLocaleString()} | {e.location || "-"}
                  </div>
                </div>
                <span className="badge">{e.visibility}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
