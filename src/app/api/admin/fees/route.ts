import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";
import User from "@/models/User";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();
  const { searchParams } = new URL(req.url);

  const month = searchParams.get("month") || undefined;
  const status = searchParams.get("status") || undefined; // unpaid|partial|paid|waived
  const role = searchParams.get("role") || undefined;     // Admin|Member
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const skip = (page - 1) * limit;

  const userFilter: any = {};
  if (role) userFilter.role = role;

  let userIds: string[] | undefined;
  if (role) {
    const users = await User.find(userFilter, { _id: 1 }).lean();
    userIds = users.map((u) => String(u._id));
  }

  const q: any = {};
  if (month) q.month = month;
  if (status) q.status = status;
  if (userIds) q.userId = { $in: userIds };

  const [items, total] = await Promise.all([
    Fee.find(q).sort({ month: -1 }).skip(skip).limit(limit)
      .populate("userId", "name email role")
      .lean(),
    Fee.countDocuments(q),
  ]);

  return NextResponse.json({ ok: true, items, page, limit, total });
}
