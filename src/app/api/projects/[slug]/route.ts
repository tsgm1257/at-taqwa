import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;
  const item = await Project.findOne({ slug }).lean();
  if (!item) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, item });
}
