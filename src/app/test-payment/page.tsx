"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

export default function TestPaymentPage() {
  const [amount, setAmount] = useState<number>(100);
  const [method, setMethod] = useState<"sslcommerz" | "bkash" | "nagad">("sslcommerz");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/donations/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount, 
          method, 
          currency: "BDT",
          note: "Test payment from development page"
        }),
      });

      const result = await response.json();

      if (result.ok) {
        if (result.redirectUrl) {
          // Redirect to payment gateway
          window.location.href = result.redirectUrl;
        } else {
          setMessage(`Payment initiated successfully! ID: ${result.id}`);
        }
      } else {
        setMessage(`Error: ${result.error || "Payment initiation failed"}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-emerald-950 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Test Payment Integration
          </h1>

          {/* Amount Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (BDT)
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-emerald-800 dark:text-white"
              placeholder="Enter amount"
            />
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMethod("sslcommerz")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  method === "sslcommerz"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-800"
                    : "border-gray-200 dark:border-emerald-600 hover:border-emerald-300"
                }`}
              >
                <CreditCard className="w-6 h-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  SSLCommerz
                </span>
              </button>

              <button
                onClick={() => setMethod("bkash")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  method === "bkash"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-800"
                    : "border-gray-200 dark:border-emerald-600 hover:border-emerald-300"
                }`}
              >
                <Smartphone className="w-6 h-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  bKash
                </span>
              </button>

              <button
                onClick={() => setMethod("nagad")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  method === "nagad"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-800"
                    : "border-gray-200 dark:border-emerald-600 hover:border-emerald-300"
                }`}
              >
                <Wallet className="w-6 h-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nagad
                </span>
              </button>
            </div>
          </div>

          {/* Test Cards Info */}
          {method === "sslcommerz" && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Test Card Numbers:
              </h3>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <div><strong>Success:</strong> 4111111111111111</div>
                <div><strong>Failure:</strong> 4000000000000002</div>
                <div><strong>Expiry:</strong> Any future date</div>
                <div><strong>CVV:</strong> Any 3 digits</div>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading || amount < 1}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Test Payment - ৳{amount}
              </>
            )}
          </button>

          {/* Message Display */}
          {message && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-emerald-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-emerald-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructions:
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Make sure you're logged in to test payments</li>
              <li>• SSLCommerz will redirect you to their payment page</li>
              <li>• Use the test card numbers provided above</li>
              <li>• Check your donation history after successful payment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
