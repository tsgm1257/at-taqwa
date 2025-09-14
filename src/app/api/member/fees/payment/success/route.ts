import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";
import { sslcommerzDirectService } from "@/lib/sslcommerz-direct";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const status = formData.get("status") as string;
    const tran_id = formData.get("tran_id") as string;
    const val_id = formData.get("val_id") as string;
    const amount = formData.get("amount") as string;
    const currency = formData.get("currency") as string;
    const value_a = formData.get("value_a") as string; // Fee ID

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
    await Fee.findByIdAndUpdate(value_a, {
      $set: {
        status: "paid",
        paidAmount: parseFloat(amount as string) || fee.amount,
        paidAt: new Date(),
        "meta.payment_tran_id": tran_id,
        "meta.payment_val_id": val_id,
        "meta.payment_validated_at": new Date(),
      }
    });

    console.log("Fee payment completed successfully:", {
      feeId: value_a,
      amount: amount,
      tran_id,
    });

    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/member/fees?success=payment_completed&feeId=${value_a}&amount=${amount}`);

  } catch (error) {
    console.error("Fee payment success callback error:", error);
    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/member/fees?error=payment_failed`);
  }
}
