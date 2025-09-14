"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowRight, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DonationFailedPage() {
  const searchParams = useSearchParams();
  const [failureDetails, setFailureDetails] = useState<{
    tran_id: string | null;
    reason: string | null;
  }>({
    tran_id: null,
    reason: null,
  });

  useEffect(() => {
    const tran_id = searchParams.get("tran_id");
    const reason = searchParams.get("reason");
    
    setFailureDetails({ tran_id, reason });
  }, [searchParams]);

  const getFailureMessage = (reason: string | null) => {
    switch (reason) {
      case "validation_failed":
        return "Payment validation failed. Please contact support if the amount was deducted.";
      case "server_error":
        return "A server error occurred. Please try again later.";
      case "payment_failed":
        return "Your payment could not be processed. Please check your payment details and try again.";
      default:
        return "Your payment could not be completed. Please try again or contact support.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-red-950 dark:to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-8 text-center">
          {/* Failure Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Failure Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {getFailureMessage(failureDetails.reason)}
          </p>

          {/* Transaction Details */}
          {failureDetails.tran_id && (
            <div className="bg-gray-50 dark:bg-emerald-800 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-xs">{failureDetails.tran_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-red-600 dark:text-red-400 font-semibold">Failed</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/donate"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>
            
            <Link
              href="/"
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-emerald-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              If you continue to experience issues, please contact our support team with your transaction ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
