import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";
import { adminFeeUpdateSchema } from "@/lib/validators/fees";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = adminFeeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  await dbConnect();

  const update: any = { ...parsed.data };
  if (parsed.data.paidAt) update.paidAt = new Date(parsed.data.paidAt);
  // convenience: set paidAt automatically if status becomes "paid" and no paidAt provided
  if (parsed.data.status === "paid" && !parsed.data.paidAt) update.paidAt = new Date();

  const doc = await Fee.findByIdAndUpdate(params.id, update, { new: true }).lean();
  if (!doc) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, item: doc });
}
