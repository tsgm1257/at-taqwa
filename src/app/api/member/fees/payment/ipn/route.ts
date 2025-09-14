import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const status = formData.get("status") as string;
    const tran_id = formData.get("tran_id") as string;
    const val_id = formData.get("val_id") as string;
    const amount = formData.get("amount") as string;
    const value_a = formData.get("value_a") as string; // Fee ID

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
      await Fee.findByIdAndUpdate(value_a, {
        $set: {
          status: "paid",
          paidAmount: parseFloat(amount as string),
          paidAt: new Date(),
          "meta.ipn_status": status,
          "meta.ipn_processed_at": new Date(),
        }
      });

      console.log("Fee payment IPN processed successfully:", value_a);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Fee payment IPN error:", error);
    return NextResponse.json({ ok: false, error: "IPN processing failed" }, { status: 500 });
  }
}
