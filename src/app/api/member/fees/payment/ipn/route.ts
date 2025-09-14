import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleIPN(req);
}

export async function GET(req: Request) {
  return handleIPN(req);
}

async function handleIPN(req: Request) {
  try {
    let status, tran_id, val_id, amount, value_a;
    
    try {
      const formData = await req.formData();
      status = formData.get("status") as string;
      tran_id = formData.get("tran_id") as string;
      val_id = formData.get("val_id") as string;
      amount = formData.get("amount") as string;
      value_a = formData.get("value_a") as string; // Fee ID
    } catch {
      // If form data fails, try query parameters
      const url = new URL(req.url);
      status = url.searchParams.get("status");
      tran_id = url.searchParams.get("tran_id");
      val_id = url.searchParams.get("val_id");
      amount = url.searchParams.get("amount");
      value_a = url.searchParams.get("value_a"); // Fee ID
    }

    console.log("Fee payment IPN received:", {
      status,
      tran_id,
      val_id,
      amount,
      feeId: value_a,
    });

    if (!value_a) {
      return NextResponse.json({ ok: false, error: "Fee ID not found" }, { status: 400 });
    }

    await dbConnect();

    // Update fee status if payment is successful
    if (status === "VALID" || status === "VALIDATED") {
      const updateResult = await Fee.findByIdAndUpdate(value_a, {
        $set: {
          status: "paid",
          paidAmount: parseFloat(amount as string),
          paidAt: new Date(),
          "meta.ipn_status": status,
          "meta.ipn_processed_at": new Date(),
        }
      }, { new: true });

      console.log("Fee payment IPN processed successfully:", {
        feeId: value_a,
        updatedStatus: updateResult?.status,
      });
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Fee payment IPN error:", error);
    return NextResponse.json({ ok: false, error: "IPN processing failed" }, { status: 500 });
  }
}
