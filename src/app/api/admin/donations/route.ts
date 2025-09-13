import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import User from "@/models/User";
import Project from "@/models/Project";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;   // initiated|pending|succeeded|failed|refunded
  const method = searchParams.get("method") || undefined;   // sslcommerz|bkash|nagad|cash
  const projectSlug = searchParams.get("projectSlug") || undefined;
  const email = searchParams.get("email") || undefined;

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const skip = (page - 1) * limit;

  const q: any = {};
  if (status) q.status = status;
  if (method) q.method = method;

  if (email) {
    const u = await User.findOne({ email }, { _id: 1 }).lean();
    q.userId = u ? u._id : null;
  }

  if (projectSlug) {
    const p = await Project.findOne({ slug: projectSlug }, { _id: 1 }).lean();
    q.projectId = p ? p._id : null;
  }

  const [items, total] = await Promise.all([
    Donation.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("projectId", "title slug")
      .populate("userId", "name email role")
      .lean(),
    Donation.countDocuments(q),
  ]);

  return NextResponse.json({ ok: true, items, page, limit, total });
}
