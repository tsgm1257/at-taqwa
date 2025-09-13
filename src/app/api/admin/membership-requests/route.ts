import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import MembershipRequest from "@/models/MembershipRequest";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user && typeof session.user === "object" && "role" in session.user) {
    if ((session.user as { role?: string }).role !== "Admin") {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
  } else {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "pending";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const skip = (page - 1) * limit;

  await dbConnect();

  const [items, total] = await Promise.all([
    MembershipRequest.find({ status }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    MembershipRequest.countDocuments({ status }),
  ]);

  return NextResponse.json({ ok: true, items, page, limit, total });
}
