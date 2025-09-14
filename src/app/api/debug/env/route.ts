import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check essential environment variables
    const envCheck = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      MONGODB_URI: !!process.env.MONGODB_URI,
      NODE_ENV: process.env.NODE_ENV,
      // Don't expose actual values for security
      NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET?.length || 0,
      MONGODB_URI_PREFIX: process.env.MONGODB_URI?.substring(0, 10) || "not set",
    };

    return NextResponse.json({
      success: true,
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Environment check error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to check environment variables",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
