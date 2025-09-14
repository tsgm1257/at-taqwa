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
      value_a, // Donation ID
      value_b, // User ID
    } = Object.fromEntries(formData.entries());

    // Find the donation record and update status to failed (cancelled)
    if (value_a) {
      await Donation.findByIdAndUpdate(value_a, {
        status: "failed",
        meta: {
          failure_reason: "Payment cancelled by user",
          ssl_status: status,
          ssl_tran_id: tran_id,
        },
      });
    }

    // Redirect to cancellation page
    const baseUrl = new URL(req.url).origin;
    const redirectUrl =
      tran_id && tran_id !== "null" && tran_id !== ""
        ? `${baseUrl}/donations/cancelled?tran_id=${tran_id}`
        : `${baseUrl}/donations/cancelled`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("SSLCommerz cancel callback error:", error);
    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(
      `${baseUrl}/donations/cancelled?reason=server_error`
    );
  }
}

export async function GET(req: NextRequest) {
  // Handle GET requests
  const { searchParams } = new URL(req.url);
  const tran_id = searchParams.get("tran_id");

  const baseUrl = new URL(req.url).origin;
  const redirectUrl =
    tran_id && tran_id !== "null" && tran_id !== ""
      ? `${baseUrl}/donations/cancelled?tran_id=${tran_id}`
      : `${baseUrl}/donations/cancelled`;
  return NextResponse.redirect(redirectUrl);
}
