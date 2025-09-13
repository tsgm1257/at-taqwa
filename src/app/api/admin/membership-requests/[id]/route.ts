import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import MembershipRequest from "@/models/MembershipRequest";
import User from "@/models/User";
import { membershipModerateSchema } from "@/lib/validators/membership";

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await _req.json();
    const parsed = membershipModerateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const { action } = parsed.data;
    await dbConnect();

    const reqDoc = await MembershipRequest.findById(params.id);
    if (!reqDoc) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    if (reqDoc.status !== "pending") {
      return NextResponse.json({ ok: false, error: "Already reviewed" }, { status: 409 });
    }

    reqDoc.status = action === "approve" ? "approved" : "denied";
    reqDoc.reviewedBy = session.user?.email || "admin";
    reqDoc.reviewedAt = new Date();
    await reqDoc.save();

    // If approved and user already exists, upgrade role to Member
    if (action === "approve") {
      const user = await User.findOne({ email: reqDoc.email });
      if (user && user.role !== "Admin") {
        user.role = "Member";
        await user.save();
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Update failed" }, { status: 500 });
  }
}
