import Link from "next/link";

type Project = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  coverImageUrl?: string;
  status: "active" | "completed" | "paused";
};

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/projects`, { cache: "no-store" });
  const json = await res.json();
  return json.items || [];
}

export default async function ProjectsPage() {
  const items = await fetchProjects();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Projects & Campaigns</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {items.map((p) => {
          const progress = p.targetAmount ? Math.min(100, Math.round((p.raisedAmount / p.targetAmount) * 100)) : 0;
          return (
            <div key={p._id} className="card bg-base-100 shadow">
              {p.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImageUrl} alt={p.title} className="h-40 w-full object-cover" />
              )}
              <div className="card-body">
                <h2 className="card-title">{p.title}</h2>
                <p className="line-clamp-3">{p.description}</p>
                <div className="mt-2">
                  <progress className="progress w-full" value={progress} max="100"></progress>
                  <div className="text-sm mt-1">
                    Raised {p.raisedAmount} / {p.targetAmount} BDT ({progress}%)
                  </div>
                </div>
                <div className="card-actions mt-3">
                  <Link className="btn btn-primary" href={`/projects/${p.slug}`}>View</Link>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p>No projects yet.</p>}
      </div>
    </div>
  );
}
