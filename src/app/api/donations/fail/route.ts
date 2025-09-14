import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    const {
      status,
      tran_id,
      error,
      value_a, // Donation ID
      value_b, // User ID
    } = Object.fromEntries(formData.entries());

    // Find the donation record and update status to failed
    if (value_a) {
      await Donation.findByIdAndUpdate(value_a, {
        status: "failed",
        meta: {
          failure_reason: error || "Payment failed",
          ssl_status: status,
          ssl_tran_id: tran_id,
        }
      });
    }

    // Redirect to failure page
    return NextResponse.redirect(
      new URL(`/donations/failed?tran_id=${tran_id}&reason=${error || "payment_failed"}`, req.url)
    );

  } catch (error) {
    console.error("SSLCommerz fail callback error:", error);
    return NextResponse.redirect(
      new URL("/donations/failed?reason=server_error", req.url)
    );
  }
}

export async function GET(req: NextRequest) {
  // Handle GET requests
  const { searchParams } = new URL(req.url);
  const tran_id = searchParams.get("tran_id");
  const reason = searchParams.get("reason");

  return NextResponse.redirect(
    new URL(`/donations/failed?tran_id=${tran_id}&reason=${reason || "payment_failed"}`, req.url)
  );
}
