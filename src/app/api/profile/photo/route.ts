import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs"; // ensure Node runtime for Buffer/FormData

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "Only image files allowed" }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB guard
      return NextResponse.json({ ok: false, error: "Max size 2MB" }, { status: 413 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) throw new Error("IMGBB_API_KEY not set");

    // Convert to base64 for imgbb
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Build form-data for imgbb
    const uploadForm = new FormData();
    uploadForm.append("image", base64);
    uploadForm.append("name", `profile_${Date.now()}`);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: uploadForm,
    });
    const data = await res.json();

    if (!data?.success) {
      const msg = data?.error?.message || "imgbb upload failed";
      return NextResponse.json({ ok: false, error: msg }, { status: 502 });
    }

    const url: string = data.data.url;
    const deleteUrl: string | undefined = data.data.delete_url;

    await dbConnect();
    await User.updateOne(
      { email: session.user.email },
      { $set: { profilePicUrl: url } }
    );

    return NextResponse.json({ ok: true, url, deleteUrl }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Upload error" },
      { status: 500 }
    );
  }
}
