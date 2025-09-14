import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleCallback(req);
}

export async function GET(req: Request) {
  return handleCallback(req);
}

async function handleCallback(req: Request) {
  try {
    let tran_id, value_a;
    
    try {
      const formData = await req.formData();
      tran_id = formData.get("tran_id") as string;
      value_a = formData.get("value_a") as string; // Fee ID
    } catch {
      // If form data fails, try query parameters
      const url = new URL(req.url);
      tran_id = url.searchParams.get("tran_id");
      value_a = url.searchParams.get("value_a"); // Fee ID
    }

    console.log("Fee payment cancelled:", {
      tran_id,
      feeId: value_a,
    });

    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/member/fees?error=payment_cancelled&feeId=${value_a}&tran_id=${tran_id}`);

  } catch (error) {
    console.error("Fee payment cancel callback error:", error);
    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(`${baseUrl}/member/fees?error=callback_error`);
  }
}
