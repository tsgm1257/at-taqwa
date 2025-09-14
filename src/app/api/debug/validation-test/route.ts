import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    message: "Validation test endpoint - updated version",
    timestamp: new Date().toISOString(),
    version: "1.1.0",
    test: "This endpoint confirms the latest changes are deployed"
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const entries = Array.from(formData.entries());
    
    return NextResponse.json({
      message: "Form data received",
      entries,
      count: entries.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to parse form data",
      details: String(error),
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
