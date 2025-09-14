import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";
import { projectCreateSchema } from "@/lib/validators/content";
import { slugify } from "@/lib/slug";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();

  const slug = slugify(parsed.data.title);
  const exists = await Project.findOne({ slug }).lean();
  if (exists) {
    return NextResponse.json(
      { ok: false, error: "A project with a similar title already exists." },
      { status: 409 }
    );
  }

  const item = await Project.create({
    ...parsed.data,
    slug,
    startDate: parsed.data.startDate
      ? new Date(parsed.data.startDate)
      : new Date(),
    endDate:
      parsed.data.endDate && parsed.data.endDate !== ""
        ? new Date(parsed.data.endDate)
        : undefined,
    createdBy: null,
  });

  return NextResponse.json(
    { ok: true, id: String(item._id), slug: item.slug },
    { status: 201 }
  );
}
