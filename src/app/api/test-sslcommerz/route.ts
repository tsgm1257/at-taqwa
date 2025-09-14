import { NextResponse } from "next/server";
import { sslcommerzService } from "@/lib/sslcommerz";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check environment variables
    const storeId = process.env.SSLCZ_STORE_ID;
    const storePasswd = process.env.SSLCZ_STORE_PASSWD;
    const isSandbox = process.env.SSLCZ_IS_SANDBOX;

    console.log("SSLCommerz Environment Check:", {
      storeId: storeId ? `${storeId.substring(0, 4)}***` : "NOT SET",
      storePasswd: storePasswd ? "***SET***" : "NOT SET",
      isSandbox: isSandbox,
    });

    if (!storeId || !storePasswd || storeId === "your_store_id_here") {
      return NextResponse.json({
        status: "error",
        message: "SSLCommerz credentials not configured",
        details: {
          storeId: storeId || "NOT SET",
          storePasswd: storePasswd ? "SET" : "NOT SET",
          isSandbox: isSandbox,
        }
      });
    }

    // Test SSLCommerz service initialization
    const testConfig = {
      total_amount: 100,
      currency: "BDT",
      tran_id: `TEST_${Date.now()}`,
      success_url: "http://localhost:3000/api/donations/success",
      fail_url: "http://localhost:3000/api/donations/fail",
      cancel_url: "http://localhost:3000/api/donations/cancel",
      ipn_url: "http://localhost:3000/api/donations/ipn",
      cus_name: "Test User",
      cus_email: "test@example.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
      value_a: "test_donation_id",
      value_b: "test_user_id",
      value_c: "",
      value_d: "Test payment",
    };

    const result = await sslcommerzService.initiatePayment(testConfig);
    
    return NextResponse.json({
      status: "success",
      message: "SSLCommerz service is working",
      result: {
        status: result.status,
        gatewayUrl: result.GatewayPageURL ? "Generated" : "Not generated",
        sessionkey: result.sessionkey ? "Generated" : "Not generated",
      }
    });

  } catch (error) {
    console.error("SSLCommerz test error:", error);
    return NextResponse.json({
      status: "error",
      message: "SSLCommerz service error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
