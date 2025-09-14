import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Test database connection
    let dbStatus = "not connected";
    try {
      await dbConnect();
      dbStatus = "connected";
    } catch (dbError) {
      dbStatus = `error: ${String(dbError)}`;
    }

    // Test environment variables
    const envStatus = {
      MONGODB_URI_SET: !!process.env.MONGODB_URI,
      SSLCZ_STORE_ID_SET: !!process.env.SSLCZ_STORE_ID,
      SSLCZ_STORE_PASSWD_SET: !!process.env.SSLCZ_STORE_PASSWD,
      SSLCZ_IS_SANDBOX: process.env.SSLCZ_IS_SANDBOX,
      NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    };

    // Test SSLCommerz credentials
    let sslcommerzStatus = "not configured";
    try {
      const storeId = env.SSLCZ.STORE_ID();
      const storePasswd = env.SSLCZ.STORE_PASSWD();
      const isSandbox = env.SSLCZ.IS_SANDBOX();
      sslcommerzStatus = `configured (sandbox: ${isSandbox})`;
    } catch (sslError) {
      sslcommerzStatus = `error: ${String(sslError)}`;
    }

    return NextResponse.json({
      ok: true,
      debug: {
        session: {
          exists: !!session,
          userId: userId || "anonymous",
          userRole: (session?.user as any)?.role || "none"
        },
        database: {
          status: dbStatus
        },
        environment: envStatus,
        sslcommerz: {
          status: sslcommerzStatus
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: "Debug endpoint failed",
        details: String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    
    return NextResponse.json({
      ok: true,
      debug: {
        method: "POST",
        bodyReceived: !!body,
        bodyType: typeof body,
        bodyKeys: body ? Object.keys(body) : [],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Debug POST error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: "Debug POST failed",
        details: String(error)
      },
      { status: 500 }
    );
  }
}
