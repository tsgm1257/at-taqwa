import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers";

export default function QuickDonate() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one_time"); // 'one_time' or 'recurring'
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleDonate = async () => {
    // Check if recurring donation is selected
    if (donationType === "recurring") {
      alert(
        'Recurring donations will be implemented soon! Please select "One Time" for now.'
      );
      return;
    }

    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount <= 0) {
      alert("Please select or enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      // Create a donation record
      const response = await fetch("/api/donations/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "BDT",
          method: "sslcommerz",
          note: "Quick donation from homepage",
          type: "general",
        }),
      });

      const data = await response.json();

      if (data.ok && data.redirectUrl) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Donation error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process donation. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZakatSadaqah = () => {
    // For now, redirect to the main donate page with a note
    router.push("/donate?type=zakat");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[100, 250, 500, 1000].map((amt) => (
          <button
            key={amt}
            onClick={() => handleAmountSelect(amt)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              selectedAmount === amt
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-emerald-200 dark:border-emerald-800/60 bg-white/60 dark:bg-emerald-900/20 hover:shadow-md"
            }`}
          >
            ৳{amt}
          </button>
        ))}
      </div>

      {/* Custom Amount Input */}
      <div>
        <input
          type="number"
          inputMode="decimal"
          placeholder={t("custom_amount") || "Custom Amount"}
          value={customAmount}
          onChange={handleCustomAmountChange}
          className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 px-4 py-2 outline-none"
        />
      </div>

      {/* One Time / Recurring Selection */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setDonationType("one_time")}
          className={`rounded-lg px-3 py-2 font-semibold transition ${
            donationType === "one_time"
              ? "bg-emerald-500 text-white"
              : "border border-emerald-300/60 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          }`}
        >
          {t("one_time") || "One Time"}
        </button>
        <button
          onClick={() => setDonationType("recurring")}
          className={`rounded-lg px-3 py-2 font-semibold transition ${
            donationType === "recurring"
              ? "bg-emerald-500 text-white"
              : "border border-emerald-300/60 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          }`}
        >
          {t("recurring") || "Recurring"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDonate}
          disabled={isLoading || (!selectedAmount && !customAmount)}
          className="rounded-xl border border-emerald-300/60 bg-emerald-500 text-white px-4 py-2 font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Give Now"}
        </button>
        <button
          onClick={handleZakatSadaqah}
          className="rounded-xl border border-yellow-300/60 bg-yellow-400/90 text-emerald-950 px-4 py-2 font-semibold hover:bg-yellow-500 transition"
        >
          Zakat / Sadaqah
        </button>
      </div>
    </div>
  );
}
