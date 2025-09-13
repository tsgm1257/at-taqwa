type Ann = {
  _id: string;
  title: string;
  body: string;
  publishedAt: string;
  pinned: boolean;
  marquee: boolean;
};

async function fetchAnnouncements(): Promise<Ann[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/announcements`, { cache: "no-store" });
  const json = await res.json();
  return json.items || [];
}

export default async function AnnouncementsPage() {
  const items = await fetchAnnouncements();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Announcements</h1>
      <div className="mt-6 space-y-4">
        {items.map(a => (
          <div key={a._id} className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-center gap-2">
                {a.pinned && <span className="badge badge-warning">Pinned</span>}
                <h2 className="card-title">{a.title}</h2>
              </div>
              <p className="whitespace-pre-wrap">{a.body}</p>
              <div className="text-xs opacity-70 mt-2">
                {new Date(a.publishedAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p>No announcements yet.</p>}
      </div>
    </div>
  );
}
