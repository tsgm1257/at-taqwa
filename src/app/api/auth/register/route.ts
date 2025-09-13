import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
    }

    await dbConnect();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name || "",
      email,
      passwordHash,
      role: ["Admin", "Member", "User"].includes(role) ? role : "User",
    });

    return NextResponse.json({ ok: true, id: String(user._id) }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Register failed" }, { status: 500 });
  }
}
