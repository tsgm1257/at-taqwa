import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;
    const value_a = formData.get("value_a") as string; // Fee ID

    console.log("Fee payment failed:", {
      tran_id,
      feeId: value_a,
    });

    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/member/fees?error=payment_failed&feeId=${value_a}&tran_id=${tran_id}`);

  } catch (error) {
    console.error("Fee payment fail callback error:", error);
    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/member/fees?error=callback_error`);
  }
}
