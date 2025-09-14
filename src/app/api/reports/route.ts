import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Report from "@/models/Report";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const year = searchParams.get("year") || "";
  const q = searchParams.get("q")?.trim();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const skip = (page - 1) * limit;

  // Define the type for the query object
  interface ReportQuery {
    published: boolean;
    month?: RegExp;
    $or?: Array<Record<string, unknown>>;
  }

  const query: ReportQuery = { published: true };
  if (year) query.month = new RegExp(`^${year}-\\d{2}$`); // YYYY-__

  if (q) {
    // fuzzy search over title OR category names inside income/expense
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { "income.category": { $regex: q, $options: "i" } },
      { "expense.category": { $regex: q, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Report.find(query)
      .sort({ month: -1 })
      .skip(skip)
      .limit(limit)
      .select("title month currency totalIncome totalExpense closingBalance summary")
      .lean(),
    Report.countDocuments(query),
  ]);

  return NextResponse.json({ ok: true, items, page, limit, total });
}
