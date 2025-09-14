import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const feeId = url.searchParams.get("feeId");
    
    if (!feeId) {
      return NextResponse.json({ 
        ok: false, 
        error: "Fee ID is required" 
      }, { status: 400 });
    }

    await dbConnect();
    
    const fee = await Fee.findById(feeId).lean();
    
    if (!fee) {
      return NextResponse.json({ 
        ok: false, 
        error: "Fee not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      fee: {
        _id: fee._id,
        userId: fee.userId,
        month: fee.month,
        amount: fee.amount,
        status: fee.status,
        paidAmount: fee.paidAmount,
        paidAt: fee.paidAt,
        meta: fee.meta,
        createdAt: fee.createdAt,
        updatedAt: fee.updatedAt,
      }
    });

  } catch (error) {
    console.error("Debug fee payment error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch fee data" },
      { status: 500 }
    );
  }
}
