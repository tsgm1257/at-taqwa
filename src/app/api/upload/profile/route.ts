import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime for File/Buffer
export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  try {
    const key = process.env.IMGBB_API_KEY;
    if (!key) {
      return NextResponse.json(
        { ok: false, error: "IMGBB_API_KEY missing" },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "file is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Only JPG, PNG, WEBP allowed" },
        { status: 415 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Max size 2MB" },
        { status: 413 }
      );
    }

    // Convert to base64 for imgbb
    const arrayBuf = await file.arrayBuffer();
    const b64 = Buffer.from(arrayBuf).toString("base64");

    const imgbbForm = new FormData();
    imgbbForm.append("image", b64);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body: imgbbForm,
    });

    const json = await res.json();
    if (!res.ok || !json?.data?.url) {
      return NextResponse.json(
        { ok: false, error: json?.error?.message || "Upload failed" },
        { status: 502 }
      );
    }

    const url: string = json.data.url;

    return NextResponse.json({ ok: true, url });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Upload error";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
