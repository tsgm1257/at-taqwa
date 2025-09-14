import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import Project from "@/models/Project";
import { sslcommerzService } from "@/lib/sslcommerz";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    const {
      status,
      tran_id,
      val_id,
      amount,
      store_amount,
      currency,
      bank_tran_id,
      card_type,
      card_no,
      card_issuer,
      card_brand,
      card_issuer_country,
      card_issuer_country_code,
      store_id,
      verify_sign,
      verify_key,
      risk_level,
      risk_title,
      value_a, // Donation ID
      value_b, // User ID
      value_c, // Project ID
      value_d, // Note
    } = Object.fromEntries(formData.entries());

    // Validate the payment
    if (status === "VALID" || status === "VALIDATED") {
      try {
        const validationResult = await sslcommerzService.validatePayment(
          val_id as string,
          parseFloat(amount as string),
          currency as string
        );

        if (validationResult.status === "VALID" || validationResult.status === "VALIDATED") {
          // Find the donation record
          const donation = await Donation.findById(value_a);
          
          if (donation && donation.status === "initiated") {
            // Update donation status to succeeded
            await Donation.findByIdAndUpdate(value_a, {
              status: "succeeded",
              meta: {
                ...donation.meta,
                ssl_validation: validationResult,
                payment_details: {
                  tran_id,
                  val_id,
                  amount,
                  store_amount,
                  currency,
                  bank_tran_id,
                  card_type,
                  card_no,
                  card_issuer,
                  card_brand,
                  card_issuer_country,
                  card_issuer_country_code,
                  store_id,
                  verify_sign,
                  verify_key,
                  risk_level,
                  risk_title,
                }
              }
            });

            // Update project raised amount if donation is linked to a project
            if (value_c) {
              await Project.findByIdAndUpdate(value_c, {
                $inc: { currentAmount: parseFloat(amount as string) }
              });
            }

            // Redirect to success page
            return NextResponse.redirect(
              new URL(`/donations/success?tran_id=${tran_id}&amount=${amount}`, req.url)
            );
          }
        }
      } catch (validationError) {
        console.error("Payment validation error:", validationError);
      }
    }

    // If validation fails, redirect to failure page
    return NextResponse.redirect(
      new URL(`/donations/failed?tran_id=${tran_id}&reason=validation_failed`, req.url)
    );

  } catch (error) {
    console.error("SSLCommerz success callback error:", error);
    return NextResponse.redirect(
      new URL("/donations/failed?reason=server_error", req.url)
    );
  }
}

export async function GET(req: NextRequest) {
  // Handle GET requests (in case user navigates directly)
  const { searchParams } = new URL(req.url);
  const tran_id = searchParams.get("tran_id");
  const amount = searchParams.get("amount");

  if (tran_id && amount) {
    return NextResponse.redirect(
      new URL(`/donations/success?tran_id=${tran_id}&amount=${amount}`, req.url)
    );
  }

  return NextResponse.redirect(new URL("/donations", req.url));
}
