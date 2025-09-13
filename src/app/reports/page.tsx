type Row = {
  _id: string;
  title: string;
  month: string;       // "YYYY-MM"
  currency: string;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  summary?: string;
};

async function fetchReports(year?: string, q?: string): Promise<Row[]> {
  const params = new URLSearchParams();
  if (year) params.set("year", year);
  if (q) params.set("q", q);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/reports?${params.toString()}`, { cache: "no-store" });
  const json = await res.json();
  return json.items || [];
}

export default async function ReportsPage({ searchParams }: { searchParams: { year?: string; q?: string } }) {
  const year = searchParams?.year || "";
  const q = searchParams?.q || "";
  const items = await fetchReports(year, q);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Financial Reports</h1>

      <form className="mt-4 grid gap-3 md:grid-cols-3">
        <input name="year" defaultValue={year} placeholder="Year (e.g., 2025)" className="input input-bordered" />
        <input name="q" defaultValue={q} placeholder="Search (title/category)" className="input input-bordered" />
        <button className="btn btn-primary">Filter</button>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((r) => (
          <div key={r._id} className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-center justify-between gap-3">
                <h2 className="card-title">{r.title}</h2>
                <span className="badge">{r.month}</span>
              </div>
              <div className="grid md:grid-cols-3 gap-3 mt-3">
                <div className="stat">
                  <div className="stat-title">Income</div>
                  <div className="stat-value">{r.totalIncome} {r.currency}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Expense</div>
                  <div className="stat-value">{r.totalExpense} {r.currency}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Closing</div>
                  <div className="stat-value">{r.closingBalance} {r.currency}</div>
                </div>
              </div>
              {r.summary && <p className="mt-2 whitespace-pre-wrap">{r.summary}</p>}
              <div className="card-actions mt-3">
                <a className="btn btn-primary" href={`/reports/${r.month}`}>Open</a>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p>No reports found.</p>}
      </div>
    </div>
  );
}
