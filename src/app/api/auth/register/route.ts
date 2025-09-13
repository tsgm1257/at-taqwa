import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import MembershipRequest from "@/models/MembershipRequest";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name: string | undefined = body?.name;
    const rawEmail: string | undefined = body?.email;
    const password: string | undefined = body?.password;

    if (!rawEmail || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    const email = String(rawEmail).trim().toLowerCase();

    await dbConnect();

    // Prevent duplicate accounts (case-insensitive)
    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Determine role
    let roleToSet: "Admin" | "Member" | "User" = "User";

    // If there's an approved membership request for this email, upgrade to Member
    const approvedReq = await MembershipRequest.findOne({
      email,
      status: "approved",
    })
      .lean()
      .catch(() => null);

    if (approvedReq) {
      roleToSet = "Member";
    }

    // Optional bootstrap: if no Admin exists yet, first registered user becomes Admin
    const adminExists = await User.exists({ role: "Admin" });
    if (!adminExists) {
      roleToSet = "Admin";
    }

    const user = await User.create({
      name: name || "",
      email,
      passwordHash,
      role: roleToSet,
    });

    return NextResponse.json(
      { ok: true, id: String(user._id) },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Register failed" },
      { status: 500 }
    );
  }
}
