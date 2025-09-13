import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") || "public"; // "public" shows all
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const skip = (page - 1) * limit;

  const query: any = {};
  if (scope === "public") query.visibleTo = { $in: ["all"] };

  const [items, total] = await Promise.all([
    Announcement.find(query).sort({ pinned: -1, publishedAt: -1 }).skip(skip).limit(limit).lean(),
    Announcement.countDocuments(query),
  ]);

  return NextResponse.json({ ok: true, items, page, limit, total });
}
