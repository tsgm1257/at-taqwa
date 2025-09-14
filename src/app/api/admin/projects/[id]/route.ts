import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";
import { projectUpdateSchema } from "@/lib/validators/content";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "Admin") {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();
  const { id } = await params;

  // Build update object, converting dates and generating slug if needed
  const update: Record<string, unknown> = { ...parsed.data };

  // Convert date strings to Date objects
  if (parsed.data.startDate) {
    update.startDate = new Date(parsed.data.startDate);
  }
  if (parsed.data.endDate && parsed.data.endDate !== "") {
    update.endDate = new Date(parsed.data.endDate);
  } else if (parsed.data.endDate === "") {
    update.endDate = undefined;
  }

  // Generate slug if title is being updated
  if (parsed.data.title) {
    update.slug = slugify(parsed.data.title);
  }

  const item = await Project.findByIdAndUpdate(id, update, {
    new: true,
  });
  if (!item)
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 }
    );

  return NextResponse.json({ ok: true, item });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== "Admin") {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  await dbConnect();
  const { id } = await params;
  const res = await Project.findByIdAndDelete(id);
  if (!res)
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 }
    );
  return NextResponse.json({ ok: true });
}
