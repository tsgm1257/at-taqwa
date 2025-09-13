import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Event from "@/models/Event";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user?.role ?? null) !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  await dbConnect();

  interface UpdateEvent {
    [key: string]: unknown;
    start?: Date;
    end?: Date;
  }

  const update: UpdateEvent = { ...body };
  if (body.start) update.start = new Date(body.start);
  if (body.end) update.end = new Date(body.end);

  const item = await Event.findByIdAndUpdate(params.id, update, { new: true }).lean();
  if (!item) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user?.role ?? null) !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  await dbConnect();
  const res = await Event.findByIdAndDelete(params.id);
  if (!res) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
