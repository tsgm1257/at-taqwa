"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

function DonationCancelledContent() {
  const searchParams = useSearchParams();
  const [cancellationDetails, setCancellationDetails] = useState<{
    tran_id: string | null;
    reason: string | null;
  }>({
    tran_id: null,
    reason: null,
  });

  useEffect(() => {
    const tran_id = searchParams.get("tran_id");
    const reason = searchParams.get("reason");
    
    setCancellationDetails({ tran_id, reason });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-8 text-center">
          {/* Cancellation Icon */}
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>

          {/* Cancellation Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your payment has been cancelled. No charges have been made to your account.
          </p>

          {/* Transaction Details */}
          {cancellationDetails.tran_id && (
            <div className="bg-gray-50 dark:bg-emerald-800 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-xs">{cancellationDetails.tran_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Cancelled</span>
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
              Try Again
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
              You can try making a donation again anytime. We appreciate your support for our cause.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationCancelledPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950 dark:to-emerald-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <DonationCancelledContent />
    </Suspense>
  );
}
