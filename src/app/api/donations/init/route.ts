import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import Project from "@/models/Project";
import { sslcommerzDirectService } from "@/lib/sslcommerz-direct";
import { env } from "@/lib/env";
import fetch from 'node-fetch';

// Polyfill fetch for Node.js environment
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = fetch as any;
}

export const dynamic = "force-dynamic";
import { donationInitSchema } from "@/lib/validators/donations";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = donationInitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { amount, currency, method, projectSlug, note } = parsed.data;

  await dbConnect();

  let projectId: string | undefined;
  if (projectSlug) {
    const p = await Project.findOne({ slug: projectSlug }, { _id: 1 }).lean();
    if (!p)
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    projectId = String(p._id);
  }

  // Create a pending/initiated record. We'll update to "succeeded" after gateway callback later.
  const doc = await Donation.create({
    userId,
    projectId,
    amount,
    currency: currency || "BDT",
    method, // sslcommerz | bkash | nagad (not integrated yet)
    status: "initiated",
    meta: { note },
  });

  // Handle SSLCommerz integration
  if (method === "sslcommerz") {
    try {
      // Check if SSLCommerz credentials are configured
      const storeId = process.env.SSLCZ_STORE_ID;
      const storePasswd = process.env.SSLCZ_STORE_PASSWD;
      
      if (!storeId || !storePasswd || storeId === "your_store_id_here") {
        console.log("SSLCommerz credentials not configured, falling back to pending page");
        return NextResponse.json({
          ok: true,
          id: String(doc._id),
          redirectUrl: `/donations/pending/${doc._id}`,
          error: "SSLCommerz credentials not configured. Please set SSLCZ_STORE_ID and SSLCZ_STORE_PASSWD in .env.local",
        });
      }

      const baseUrl = env.NEXTAUTH_URL();
      const tran_id = `DON_${doc._id}_${Date.now()}`;
      
      console.log("Initiating SSLCommerz payment with config:", {
        storeId: storeId.substring(0, 4) + "***",
        amount,
        tran_id,
        baseUrl
      });
      
      const paymentConfig = {
        total_amount: amount,
        currency: currency || "BDT",
        tran_id,
        success_url: `${baseUrl}/api/donations/success`,
        fail_url: `${baseUrl}/api/donations/fail`,
        cancel_url: `${baseUrl}/api/donations/cancel`,
        ipn_url: `${baseUrl}/api/donations/ipn`,
        cus_name: (session?.user as any)?.name || "Donor",
        cus_email: (session?.user as any)?.email || "donor@example.com",
        cus_add1: "Dhaka",
        cus_city: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01700000000",
        value_a: String(doc._id), // Donation ID
        value_b: userId,
        value_c: projectId || "",
        value_d: note || "",
      };

      console.log("Calling SSLCommerz service with config:", {
        total_amount: paymentConfig.total_amount,
        currency: paymentConfig.currency,
        tran_id: paymentConfig.tran_id,
        store_id: storeId.substring(0, 4) + "***"
      });

      const sslResult = await sslcommerzDirectService.initiatePayment(paymentConfig);
      
      console.log("SSLCommerz response:", {
        status: sslResult.status,
        gatewayUrl: sslResult.GatewayPageURL ? "Generated" : "Not generated",
        failedreason: sslResult.failedreason
      });
      
      if (sslResult.status === "SUCCESS" && sslResult.GatewayPageURL) {
        // Update donation with transaction ID
        await Donation.findByIdAndUpdate(doc._id, {
          meta: { 
            ...doc.meta,
            tran_id,
            ssl_sessionkey: sslResult.sessionkey,
            ssl_gw: sslResult.gw
          }
        });

        return NextResponse.json({
          ok: true,
          id: String(doc._id),
          redirectUrl: sslResult.GatewayPageURL,
          tran_id,
        });
      } else {
        throw new Error(sslResult.failedreason || "Payment initiation failed");
      }
    } catch (error) {
      console.error("SSLCommerz integration error:", error);
      // Fallback to pending page
      return NextResponse.json({
        ok: true,
        id: String(doc._id),
        redirectUrl: `/donations/pending/${doc._id}`,
        error: "Payment gateway temporarily unavailable",
      });
    }
  }

  // For other methods (bkash, nagad, cash), redirect to pending page
  const redirectUrl = `/donations/pending/${doc._id}`;
  return NextResponse.json(
    { ok: true, id: String(doc._id), redirectUrl },
    { status: 201 }
  );
}
