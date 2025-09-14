import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import MembershipRequest from "@/models/MembershipRequest";
import { membershipApplySchema } from "@/lib/validators/membership";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = membershipApplySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, notes } = parsed.data;
    await dbConnect();

    // If there is already a pending request for this email, prevent duplicates
    const pending = await MembershipRequest.findOne({
      email,
      status: "pending",
    }).lean();
    if (pending) {
      return NextResponse.json(
        {
          ok: false,
          error: "A pending request already exists for this email.",
        },
        { status: 409 }
      );
    }

    const doc = await MembershipRequest.create({ name, email, phone, notes });
    return NextResponse.json(
      { ok: true, id: String(doc._id) },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Submit failed" },
      { status: 500 }
    );
  }
}
