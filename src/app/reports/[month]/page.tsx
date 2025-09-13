import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie} from "recharts";

type Report = {
  _id: string;
  title: string;
  month: string;
  currency: string;
  openingBalance: number;
  income: { category: string; amount: number; note?: string }[];
  expense: { category: string; amount: number; note?: string }[];
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  summary?: string;
};

async function fetchReport(month: string): Promise<Report | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/reports/${month}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.item || null;
}

export default async function ReportDetail({ params }: { params: { month: string } }) {
  const r = await fetchReport(params.month);
  if (!r) return <div className="max-w-4xl mx-auto p-6">Report not found.</div>;

  const incomeData = r.income.map(i => ({ name: i.category, value: i.amount }));
  const expenseData = r.expense.map(e => ({ name: e.category, value: e.amount }));

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{r.title}</h1>
        <span className="badge">{r.month}</span>
      </div>
      {r.summary && <p className="whitespace-pre-wrap">{r.summary}</p>}

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Opening</div>
          <div className="stat-value">{r.openingBalance} {r.currency}</div>
        </div>
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-base-100 p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Income by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="table mt-4">
            <thead><tr><th>Category</th><th>Amount</th></tr></thead>
            <tbody>
              {r.income.map((i, idx) => (
                <tr key={idx}><td>{i.category}</td><td>{i.amount} {r.currency}</td></tr>
              ))}
              {r.income.length === 0 && <tr><td colSpan={2}>No income items.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="bg-base-100 p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Expenses by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={100} label />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <table className="table mt-4">
            <thead><tr><th>Category</th><th>Amount</th></tr></thead>
            <tbody>
              {r.expense.map((i, idx) => (
                <tr key={idx}><td>{i.category}</td><td>{i.amount} {r.currency}</td></tr>
              ))}
              {r.expense.length === 0 && <tr><td colSpan={2}>No expenses recorded.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
