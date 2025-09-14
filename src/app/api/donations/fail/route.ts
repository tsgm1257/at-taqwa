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
        },
      });
    }

    // Redirect to failure page
    const baseUrl = new URL(req.url).origin;
    const redirectUrl =
      tran_id && tran_id !== "null" && tran_id !== ""
        ? `${baseUrl}/donations/failed?tran_id=${tran_id}&reason=${
            error || "payment_failed"
          }`
        : `${baseUrl}/donations/failed?reason=${error || "payment_failed"}`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("SSLCommerz fail callback error:", error);
    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(
      `${baseUrl}/donations/failed?reason=server_error`
    );
  }
}

export async function GET(req: NextRequest) {
  // Handle GET requests
  const { searchParams } = new URL(req.url);
  const tran_id = searchParams.get("tran_id");
  const reason = searchParams.get("reason");

  const baseUrl = new URL(req.url).origin;
  const redirectUrl =
    tran_id && tran_id !== "null" && tran_id !== ""
      ? `${baseUrl}/donations/failed?tran_id=${tran_id}&reason=${
          reason || "payment_failed"
        }`
      : `${baseUrl}/donations/failed?reason=${reason || "payment_failed"}`;
  return NextResponse.redirect(redirectUrl);
}
