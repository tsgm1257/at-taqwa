import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";
import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, profile: user });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        ...parsed.data,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, profile: user });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
