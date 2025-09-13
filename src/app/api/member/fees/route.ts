import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";
import User from "@/models/User";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year"); // e.g., "2025"

  const q: any = { userId };
  if (year) q.month = new RegExp(`^${year}-\\d{2}$`); // "YYYY-__"

  const items = await Fee.find(q).sort({ month: 1 }).lean();
  const totals = items.reduce(
    (acc, f) => {
      acc.amount += f.amount || 0;
      if (f.status !== "paid" && f.status !== "waived") acc.due += f.amount || 0;
      return acc;
    },
    { amount: 0, due: 0 }
  );

  return NextResponse.json({ ok: true, items, totals });
}
