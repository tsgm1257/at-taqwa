import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Report from "@/models/Report";
import { reportUpdateSchema } from "@/lib/validators/reports";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }
  await dbConnect();
  const { id } = await params;
  const item = await Report.findById(id).lean();
  if (!item)
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 }
    );
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = reportUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();
  const { id } = await params;

  if (parsed.data.month) {
    const exists = await Report.findOne({
      month: parsed.data.month,
      _id: { $ne: id },
    }).lean();
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Another report already uses this month." },
        { status: 409 }
      );
    }
  }

  // use doc.save() so pre-save totals recalc fires
  const doc = await Report.findById(id);
  if (!doc)
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 }
    );

  if (parsed.data.title !== undefined) doc.title = parsed.data.title;
  if (parsed.data.month !== undefined) doc.month = parsed.data.month;
  if (parsed.data.currency !== undefined) doc.currency = parsed.data.currency;
  if (parsed.data.openingBalance !== undefined)
    doc.openingBalance = parsed.data.openingBalance;
  if (parsed.data.income !== undefined) doc.income = parsed.data.income as any;
  if (parsed.data.expense !== undefined)
    doc.expense = parsed.data.expense as any;
  if (parsed.data.summary !== undefined) doc.summary = parsed.data.summary;
  if (parsed.data.published !== undefined)
    doc.published = parsed.data.published;

  await doc.save();
  return NextResponse.json({ ok: true, item: doc.toObject() });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  await dbConnect();
  const { id } = await params;
  const item = await Report.findByIdAndDelete(id);
  if (!item) {
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Report deleted successfully",
  });
}
