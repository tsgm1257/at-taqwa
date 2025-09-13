import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import Project from "@/models/Project";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const items = await Donation.find({ userId })
    .sort({ createdAt: -1 })
    .populate("projectId", "title slug")
    .lean();

  // Summaries
  const totals = items.reduce(
    (acc, d: any) => {
      if (d.status === "succeeded") acc.total += d.amount || 0;
      return acc;
    },
    { total: 0 }
  );

  return NextResponse.json({ ok: true, items, totals });
}
