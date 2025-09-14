import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";
import { adminFeeUpdateSchema } from "@/lib/validators/fees";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user && "role" in session.user) ? (session.user as { role?: string }).role : undefined;
  if (userRole !== "Admin") {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = adminFeeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();
  const { id } = await params;
  const doc = await Fee.findById(id);
  if (!doc)
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 }
    );

  if (parsed.data.amount !== undefined) doc.amount = parsed.data.amount;
  if (parsed.data.paidAmount !== undefined) {
    // Clamp paidAmount between 0 and amount
    doc.paidAmount = Math.max(0, Math.min(parsed.data.paidAmount, doc.amount));
  }
  if (parsed.data.status) {
    doc.status = parsed.data.status;
    if (
      parsed.data.status === "paid" &&
      (doc.paidAmount === 0 || doc.paidAmount === undefined)
    ) {
      doc.paidAmount = doc.amount; // if marked paid without paidAmount, assume full
    }
    if (parsed.data.status === "unpaid") {
      doc.paidAmount = 0;
      doc.paidAt = undefined;
    }
  }
  if (parsed.data.paidAt) doc.paidAt = new Date(parsed.data.paidAt);
  if (parsed.data.notes !== undefined) doc.notes = parsed.data.notes;

  // Auto-set paidAt when it becomes paid (and wasn't set)
  if (doc.status === "paid" && !doc.paidAt) doc.paidAt = new Date();

  await doc.save();
  return NextResponse.json({ ok: true, item: doc.toObject() });
}
