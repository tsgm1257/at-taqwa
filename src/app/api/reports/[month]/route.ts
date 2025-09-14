import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Report from "@/models/Report";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ month: string }> }) {
  await dbConnect();
  const { month } = await params;
  const mm = month; // "YYYY-MM"
  const item = await Report.findOne({ month: mm, published: true }).lean();
  if (!item) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, item });
}
