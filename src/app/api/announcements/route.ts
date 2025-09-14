import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Announcement from "@/models/Announcement";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  // Filters
  const scope = searchParams.get("scope") || "public"; // "public" => visibleTo: "all"
  const marquee = searchParams.get("marquee"); // "1" => only marquee items
  const pinned = searchParams.get("pinned"); // "1" => only pinned items

  // Pagination
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};
  if (scope === "public") query.visibleTo = { $in: ["all"] };
  if (marquee === "1") query.marquee = true;
  if (pinned === "1") query.pinned = true;

  const [items, total] = await Promise.all([
    Announcement.find(query)
      .sort({ pinned: -1, publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Announcement.countDocuments(query),
  ]);

  return NextResponse.json({ ok: true, items, page, limit, total });
}
