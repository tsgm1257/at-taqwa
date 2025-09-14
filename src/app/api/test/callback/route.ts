import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    console.log("Test callback GET request received:", {
      url: url.toString(),
      searchParams: Object.fromEntries(url.searchParams.entries())
    });

    return NextResponse.json({
      ok: true,
      message: "Test callback GET endpoint working",
      params: Object.fromEntries(url.searchParams.entries())
    });
  } catch (error) {
    console.error("Test callback error:", error);
    return NextResponse.json({ ok: false, error: "Test callback failed" });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    
    console.log("Test callback POST request received:", {
      data,
      headers: Object.fromEntries(req.headers.entries())
    });

    return NextResponse.json({
      ok: true,
      message: "Test callback POST endpoint working",
      data
    });
  } catch (error) {
    console.error("Test callback error:", error);
    return NextResponse.json({ ok: false, error: "Test callback failed" });
  }
}
