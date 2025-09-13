import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";

export async function GET() {
  try {
    const conn = await dbConnect();
    // If connected, mongoose.connection.readyState should be 1
    const state = conn.connection.readyState; // 1 = connected
    return NextResponse.json({ ok: true, state }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "DB connect error" },
      { status: 500 }
    );
  }
}
