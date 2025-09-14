import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import User from "@/models/User";
import Project from "@/models/Project";
import { adminOfflineDonationSchema } from "@/lib/validators/donations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (
    session?.user &&
    typeof session.user === "object" &&
    (session.user as { role?: string }).role !== "Admin"
  ) {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const parsed = adminOfflineDonationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const {
    email,
    userId,
    amount,
    currency,
    projectId,
    projectSlug,
    receiptUrl,
    note,
  } = parsed.data;

  await dbConnect();

  // Resolve user
  let resolvedUserId = userId;
  if (!resolvedUserId && email) {
    const u = await User.findOne({ email }, { _id: 1 }).lean();
    if (!u || !("_id" in u)) {
      return NextResponse.json(
        { ok: false, error: "User email not found" },
        { status: 404 }
      );
    }
    resolvedUserId = String((u as { _id: unknown })._id);
    if (!resolvedUserId) {
      return NextResponse.json(
        { ok: false, error: "Provide userId or email" },
        { status: 400 }
      );
    }

    // Resolve project
    let resolvedProjectId = projectId;
    if (!resolvedProjectId && projectSlug) {
      const p = await Project.findOne({ slug: projectSlug }, { _id: 1 }).lean();
      if (!p || !("_id" in p)) {
        return NextResponse.json(
          { ok: false, error: "Project not found" },
          { status: 404 }
        );
      }
      resolvedProjectId = String((p as { _id: unknown })._id);
    }

    // Create succeeded cash donation
    const d = await Donation.create({
      userId: resolvedUserId,
      projectId: resolvedProjectId,
      amount,
      currency: currency || "BDT",
      method: "cash",
      status: "succeeded",
      receiptUrl,
      meta: { note, createdBy: session?.user?.email },
    });

    // Update project currentAmount if donation linked to a project
    if (resolvedProjectId) {
      await Project.findByIdAndUpdate(resolvedProjectId, {
        $inc: { currentAmount: amount },
      });
    }

    return NextResponse.json({ ok: true, id: String(d._id) }, { status: 201 });
  }
}
