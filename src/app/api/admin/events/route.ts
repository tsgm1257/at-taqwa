import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Event from "@/models/Event";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user?.role ?? null) !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { title, description, start, end, location, visibility } = await req.json();

  if (!title || !start || !end) {
    return NextResponse.json({ ok: false, error: "title, start, end required" }, { status: 400 });
  }

  await dbConnect();

  const item = await Event.create({
    title,
    description,
    start: new Date(start),
    end: new Date(end),
    location,
    visibility: visibility || "public",
  });

  return NextResponse.json({ ok: true, id: String(item._id) }, { status: 201 });
}
