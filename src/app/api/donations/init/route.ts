import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import Project from "@/models/Project";
import { donationInitSchema } from "@/lib/validators/donations";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = donationInitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const { amount, currency, method, projectSlug, note } = parsed.data;

  await dbConnect();

  let projectId: string | undefined;
  if (projectSlug) {
    const p = await Project.findOne({ slug: projectSlug }, { _id: 1 }).lean();
    if (!p) return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    projectId = String(p._id);
  }

  // Create a pending/initiated record. We'll update to "succeeded" after gateway callback later.
  const doc = await Donation.create({
    userId,
    projectId,
    amount,
    currency: currency || "BDT",
    method,                    // sslcommerz | bkash | nagad (not integrated yet)
    status: "initiated",
    meta: { note },
  });

  // For now, we just return a placeholder URL. Real gateways will redirect externally.
  const placeholderUrl = `/donations/pending/${doc._id}`;
  return NextResponse.json({ ok: true, id: String(doc._id), redirectUrl: placeholderUrl }, { status: 201 });
}
