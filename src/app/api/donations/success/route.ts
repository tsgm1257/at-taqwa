import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import Project from "@/models/Project";
import { sslcommerzDirectService } from "@/lib/sslcommerz-direct";

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

    // Log the received data for debugging
    console.log("SSLCommerz callback data:", {
      status,
      tran_id: tran_id || "NULL",
      val_id: val_id || "NULL",
      amount: amount || "NULL",
      currency: currency || "NULL",
      value_a: value_a || "NULL",
      value_c: value_c || "NULL",
    });

    // Validate the payment
    if (status === "VALID" || status === "VALIDATED") {
      const isSandbox = process.env.SSLCZ_IS_SANDBOX === "true";
      let validationResult: any = null;

      try {
        if (!sslcommerzDirectService)
          throw new Error("SSLCommerz service not available");
        const numericAmount = parseFloat(amount as string);
        if (Number.isNaN(numericAmount))
          throw new Error(`Invalid amount for validation: ${amount}`);

        validationResult = await sslcommerzDirectService.validatePayment(
          val_id as string,
          numericAmount,
          currency as string
        );
        console.log("Validation result:", validationResult);
      } catch (e) {
        console.error("Payment validation error:", e);
        // Fallback ONLY in sandbox when callback status is VALID/VALIDATED and val_id is present
        if (
          !(
            isSandbox &&
            (status === "VALID" || status === "VALIDATED") &&
            val_id
          )
        ) {
          // Non-sandbox: treat as failure
          const baseUrl = new URL(req.url).origin;
          return NextResponse.redirect(
            `${baseUrl}/donations/failed?tran_id=${tran_id}&reason=validation_failed`
          );
        }
        // In sandbox mode, proceed with validation failure noted in meta
        validationResult = {
          status: "VALID",
          ssl_validation_fallback: true,
          validation_error: e instanceof Error ? e.message : String(e),
        };
        console.warn("Validation failed in sandbox, proceeding anyway:", e);
      }

      if (
        !validationResult ||
        validationResult.status === "VALID" ||
        validationResult.status === "VALIDATED"
      ) {
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
              },
            },
          });

          // Update project raised amount if donation is linked to a project
          if (value_c) {
            const numericAmount = parseFloat(amount as string);
            if (isNaN(numericAmount)) {
              console.error(`Invalid amount for project update: ${amount}`);
            } else {
              console.log(
                `Updating project ${value_c} with amount ${numericAmount} (was: ${amount})`
              );
              const updatedProject = await Project.findByIdAndUpdate(
                value_c,
                {
                  $inc: { currentAmount: numericAmount },
                },
                { new: true }
              );
              console.log(
                `Project updated successfully:`,
                updatedProject?.currentAmount
              );
            }
          }

          // Redirect to success page
          const baseUrl = new URL(req.url).origin;
          const cleanTranId =
            tran_id && tran_id !== "null" && tran_id !== "" ? tran_id : null;
          const cleanAmount =
            amount && amount !== "null" && amount !== "" ? amount : "0";

          const successUrl = cleanTranId
            ? `${baseUrl}/donations/success?tran_id=${encodeURIComponent(
                cleanTranId
              )}&amount=${encodeURIComponent(cleanAmount)}`
            : `${baseUrl}/donations/success?amount=${encodeURIComponent(
                cleanAmount
              )}`;

          console.log("Redirecting to success page:", successUrl);
          console.log("Clean values:", { cleanTranId, cleanAmount });

          // Validate URL before redirecting
          try {
            new URL(successUrl);
            return NextResponse.redirect(successUrl);
          } catch (urlError) {
            console.error("Invalid redirect URL:", successUrl, urlError);
            // Fallback to a simple success page
            return NextResponse.redirect(`${baseUrl}/donations/success`);
          }
        }
      }
    }

    // If validation fails, redirect to failure page
    const baseUrl = new URL(req.url).origin;
    const redirectUrl =
      tran_id && tran_id !== "null" && tran_id !== ""
        ? `${baseUrl}/donations/failed?tran_id=${tran_id}&reason=validation_failed`
        : `${baseUrl}/donations/failed?reason=validation_failed`;
    console.log("Redirecting to failure page:", redirectUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("SSLCommerz success callback error:", error);
    const baseUrl = new URL(req.url).origin;
    return NextResponse.redirect(
      `${baseUrl}/donations/failed?reason=server_error`
    );
  }
}

export async function GET(req: NextRequest) {
  // Handle GET requests (in case user navigates directly)
  const { searchParams } = new URL(req.url);
  const tran_id = searchParams.get("tran_id");
  const amount = searchParams.get("amount");

  if (amount) {
    const baseUrl = new URL(req.url).origin;
    const redirectUrl =
      tran_id && tran_id !== "null" && tran_id !== ""
        ? `${baseUrl}/donations/success?tran_id=${tran_id}&amount=${amount}`
        : `${baseUrl}/donations/success?amount=${amount}`;
    console.log("GET redirect to success page:", redirectUrl);
    return NextResponse.redirect(redirectUrl);
  }

  const baseUrl = new URL(req.url).origin;
  return NextResponse.redirect(`${baseUrl}/donations`);
}
