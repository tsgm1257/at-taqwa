import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";
import User from "@/models/User";
import { sslcommerzDirectService } from "@/lib/sslcommerz-direct";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { feeId, amount } = body;

    if (!feeId || !amount) {
      return NextResponse.json(
        { ok: false, error: "Fee ID and amount are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the fee record
    const fee = await Fee.findById(feeId).populate('userId');
    if (!fee) {
      return NextResponse.json(
        { ok: false, error: "Fee not found" },
        { status: 404 }
      );
    }

    // Verify the fee belongs to the current user
    if (String(fee.userId._id) !== userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized to pay this fee" },
        { status: 403 }
      );
    }

    // Check if fee is already paid
    if (fee.status === "paid") {
      return NextResponse.json(
        { ok: false, error: "This fee is already paid" },
        { status: 400 }
      );
    }

    // Validate amount
    const feeAmount = parseFloat(amount);
    if (feeAmount <= 0 || feeAmount !== fee.amount) {
      return NextResponse.json(
        { ok: false, error: `Amount must be exactly ${fee.amount} BDT` },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if SSLCommerz credentials are configured
    const storeId = process.env.SSLCZ_STORE_ID;
    const storePasswd = process.env.SSLCZ_STORE_PASSWD;

    if (!storeId || !storePasswd || storeId === "your_store_id_here") {
      return NextResponse.json({
        ok: false,
        error: "Payment gateway not configured. Please contact administrator.",
      });
    }

    const baseUrl = env.NEXTAUTH_URL();
    const tran_id = `FEE_${feeId}_${Date.now()}`;

    console.log("Initiating fee payment with SSLCommerz:", {
      feeId,
      userId,
      amount: feeAmount,
      tran_id,
      month: fee.month,
    });

    const paymentConfig = {
      total_amount: feeAmount,
      currency: "BDT",
      tran_id,
      success_url: `${baseUrl}/api/member/fees/payment/success`,
      fail_url: `${baseUrl}/api/member/fees/payment/fail`,
      cancel_url: `${baseUrl}/api/member/fees/payment/cancel`,
      ipn_url: `${baseUrl}/api/member/fees/payment/ipn`,
      cus_name: user.name || "Member",
      cus_email: user.email,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: user.phone || "01700000000",
      value_a: String(feeId), // Fee ID
      value_b: userId,
      value_c: fee.month, // Fee month
      value_d: `Monthly fee for ${fee.month}`,
    };

    const sslResult = await sslcommerzDirectService.initiatePayment(paymentConfig);

    console.log("SSLCommerz fee payment response:", {
      status: sslResult.status,
      gatewayUrl: sslResult.GatewayPageURL ? "Generated" : "Not generated",
      failedreason: sslResult.failedreason,
    });

    if (sslResult.status === "SUCCESS" && sslResult.GatewayPageURL) {
      // Update fee with transaction ID
      await Fee.findByIdAndUpdate(feeId, {
        $set: {
          "meta.tran_id": tran_id,
          "meta.ssl_sessionkey": sslResult.sessionkey,
          "meta.ssl_gw": sslResult.gw,
          "meta.payment_initiated_at": new Date(),
        }
      });

      return NextResponse.json({
        ok: true,
        redirectUrl: sslResult.GatewayPageURL,
        tran_id,
        message: "Redirecting to payment gateway...",
      });
    } else {
      throw new Error(sslResult.failedreason || "Payment initiation failed");
    }

  } catch (error) {
    console.error("Fee payment error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
