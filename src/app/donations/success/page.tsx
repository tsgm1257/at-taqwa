"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const [donationDetails, setDonationDetails] = useState<{
    tran_id: string | null;
    amount: string | null;
  }>({
    tran_id: null,
    amount: null,
  });
  useEffect(() => {
    try {
      console.log("Success page loaded, parsing search params...");
      const tran_id = searchParams.get("tran_id");
      const amount = searchParams.get("amount");
      
      console.log("Parsed params:", { tran_id, amount });
      setDonationDetails({ tran_id, amount });
    } catch (error) {
      console.error("Error parsing search params:", error);
      // Set default values if there's an error
      setDonationDetails({ tran_id: null, amount: null });
    }
  }, [searchParams]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your generous donation. Your contribution will help
            make a difference in our community.
          </p>

          {/* Transaction Details */}
          {donationDetails.tran_id && (
            <div className="bg-gray-50 dark:bg-emerald-800 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-xs">
                    {donationDetails.tran_id}
                  </span>
                </div>
                {donationDetails.amount && (
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">
                      ৳{donationDetails.amount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/donate"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Make Another Donation
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-emerald-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You will receive a confirmation email shortly. If you have any
              questions, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-emerald-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <DonationSuccessContent />
    </Suspense>
  );
}
