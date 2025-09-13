import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Event from "@/models/Event";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  // Optional filters: by range
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const q: any = { visibility: "public" };
  if (start || end) {
    q.start = {};
    if (start) q.start.$gte = new Date(start);
    if (end) q.start.$lte = new Date(end);
  }

  const items = await Event.find(q).sort({ start: 1 }).lean();
  return NextResponse.json({ ok: true, items });
}
