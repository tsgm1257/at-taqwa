import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Report from "@/models/Report";
import { reportCreateSchema } from "@/lib/validators/reports";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year") || "";
  const q = searchParams.get("q")?.trim();
  const published = searchParams.get("published"); // "true" | "false" | "all"

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const skip = (page - 1) * limit;

  const query: any = {};
  if (year) query.month = new RegExp(`^${year}-\\d{2}$`);
  if (published === "true") query.published = true;
  else if (published === "false") query.published = false;
  if (q) {
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
      .select("title month published createdAt currency totalIncome totalExpense closingBalance")
      .lean(),
    Report.countDocuments(query),
  ]);

  return NextResponse.json({ ok: true, items, page, limit, total });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = reportCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  await dbConnect();

  const exists = await Report.findOne({ month: parsed.data.month }).lean();
  if (exists) {
    return NextResponse.json({ ok: false, error: "A report for this month already exists." }, { status: 409 });
  }

  const item = await Report.create({
    ...parsed.data,
