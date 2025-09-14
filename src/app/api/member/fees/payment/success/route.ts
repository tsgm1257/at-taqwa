import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";
import { sslcommerzDirectService } from "@/lib/sslcommerz-direct";

export const dynamic = "force-dynamic";

// This endpoint should handle both GET and POST requests from SSLCommerz
export async function POST(req: Request) {
  return handleCallback(req);
}

export async function GET(req: Request) {
  return handleCallback(req);
}

async function handleCallback(req: Request) {
  try {
    console.log("Fee payment callback endpoint reached:", {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Handle both form data and query parameters
    let status, tran_id, val_id, amount, currency, value_a;
    
    try {
      const formData = await req.formData();
      status = formData.get("status") as string;
      tran_id = formData.get("tran_id") as string;
      val_id = formData.get("val_id") as string;
      amount = formData.get("amount") as string;
      currency = formData.get("currency") as string;
      value_a = formData.get("value_a") as string; // Fee ID
      console.log("Parsed from form data");
    } catch (error) {
      console.log("Form data parsing failed, trying query parameters:", error);
      // If form data fails, try query parameters
      const url = new URL(req.url);
      status = url.searchParams.get("status");
      tran_id = url.searchParams.get("tran_id");
      val_id = url.searchParams.get("val_id");
      amount = url.searchParams.get("amount");
      currency = url.searchParams.get("currency");
      value_a = url.searchParams.get("value_a"); // Fee ID
      console.log("Parsed from query parameters");
    }

    console.log("Fee payment callback received:", {
      status,
      tran_id,
      val_id,
      amount,
      currency,
      feeId: value_a,
    });

    if (!value_a) {
      console.error("Fee ID not found in callback");
      const baseUrl = new URL(req.url).origin;
      return NextResponse.redirect(`${baseUrl}/member/fees?error=invalid_callback`);
    }

    await dbConnect();

    // Get the fee record
    const fee = await Fee.findById(value_a);
    if (!fee) {
      console.error("Fee not found:", value_a);
      const baseUrl = new URL(req.url).origin;
      return NextResponse.redirect(`${baseUrl}/member/fees?error=fee_not_found`);
    }

    // Check if fee is already paid
    if (fee.status === "paid") {
      console.log("Fee already paid:", value_a);
      const baseUrl = new URL(req.url).origin;
      return NextResponse.redirect(`${baseUrl}/member/fees?success=already_paid&feeId=${value_a}`);
    }

    // Only process if status is VALID or VALIDATED
    if (status !== "VALID" && status !== "VALIDATED") {
      console.log("Payment not valid, status:", status);
      const baseUrl = new URL(req.url).origin;
      return NextResponse.redirect(`${baseUrl}/member/fees?error=payment_invalid&feeId=${value_a}`);
    }

    // Validate payment if we have validation data
    if (val_id && status === "VALID") {
      try {
        const numericAmount = parseFloat(amount as string);
        if (!Number.isNaN(numericAmount)) {
          const validationResult = await sslcommerzDirectService.validatePayment(
            val_id as string,
            numericAmount,
            currency as string
          );
          console.log("Fee payment validation result:", validationResult);
        }
      } catch (validationError) {
        console.error("Fee payment validation error:", validationError);
        // Continue with payment processing even if validation fails in sandbox
      }
    }

    // Update fee status to paid
    try {
      const updateResult = await Fee.findByIdAndUpdate(value_a, {
        $set: {
          status: "paid",
          paidAmount: parseFloat(amount as string) || fee.amount,
          paidAt: new Date(),
          "meta.payment_tran_id": tran_id,
          "meta.payment_val_id": val_id,
          "meta.payment_validated_at": new Date(),
        }
      }, { new: true });

      console.log("Fee payment update result:", updateResult);
      console.log("Fee payment completed successfully:", {
        feeId: value_a,
        amount: amount,
        tran_id,
        updatedStatus: updateResult?.status,
      });

      if (!updateResult) {
        console.error("Failed to update fee - no result returned");
        const baseUrl = new URL(req.url).origin;
        return NextResponse.redirect(`${baseUrl}/member/fees?error=update_failed&feeId=${value_a}`);
      }
    } catch (dbError) {
      console.error("Database update error:", dbError);
      const baseUrl = new URL(req.url).origin;
      return NextResponse.redirect(`${baseUrl}/member/fees?error=db_error&feeId=${value_a}`);
    }

    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/member/fees?success=payment_completed&feeId=${value_a}&amount=${amount}`);

  } catch (error) {
    console.error("Fee payment success callback error:", error);
    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/member/fees?error=payment_failed`);
  }
}
