import DonateButton from "@/components/DonateButton";

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

async function fetchProject(slug: string): Promise<Project | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/projects/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json.item || null;
}

export default async function ProjectDetail({
  params,
}: {
  params: { slug: string };
}) {
  const p = await fetchProject(params.slug);
  if (!p) return <div className="max-w-3xl mx-auto p-6">Not found</div>;

  const progress = p.targetAmount
    ? Math.min(100, Math.round((p.raisedAmount / p.targetAmount) * 100))
    : 0;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{p.title}</h1>
      {p.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.coverImageUrl}
          alt={p.title}
          className="w-full h-64 object-cover rounded-xl mt-4"
        />
      )}
      <div className="mt-4 whitespace-pre-wrap">{p.description}</div>

      <div className="mt-6">
        <progress
          className="progress w-full"
          value={progress}
          max="100"
        ></progress>
        <div className="text-sm mt-1">
          Raised {p.raisedAmount} / {p.targetAmount} BDT ({progress}%)
        </div>
      </div>

      <div className="mt-6">
        <DonateButton projectSlug={p.slug} />
      </div>
    </div>
  );
}
