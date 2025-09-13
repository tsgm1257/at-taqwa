import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "active";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {};
  if (status) query.status = status;

  const [items, total] = await Promise.all([
    Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Project.countDocuments(query),
  ]);

  return NextResponse.json({ ok: true, items, page, limit, total });
}
