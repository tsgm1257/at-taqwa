"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HandCoins,
  Shield,
  Heart,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

type Project = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  status: "active" | "completed" | "paused";
};

export default function DonatePage() {
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = React.useState<number>(500);
  const [customAmount, setCustomAmount] = React.useState<string>("");
  const [donationType, setDonationType] = React.useState<
    "general" | "zakat" | "sadaqah"
  >("general");
  const [paymentMethod, setPaymentMethod] = React.useState<
    "sslcommerz" | "bkash" | "nagad" | "cash"
  >("sslcommerz");
  const [selectedProject, setSelectedProject] =
    React.useState<string>("general");
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    // Fetch active projects for selection
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data.items || []))
      .catch(() => setProjects([]));
  }, []);

  const quickAmounts = [100, 250, 500, 1000, 2500, 5000];

  const handleDonate = async () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount < 1) {
      setMessage("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/donations/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          method: paymentMethod,
          projectSlug: selectedProject === "general" ? null : selectedProject,
          type: donationType,
          recurring: isRecurring,
        }),
      });

      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || "Failed to process donation");
      }

      setMessage(`Donation initiated successfully! ID: ${json.id}`);

      // In a real implementation, redirect to payment gateway
      // window.location.href = json.redirectUrl;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to process donation"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "sslcommerz":
        return <CreditCard className="h-5 w-5" />;
      case "bkash":
        return <Smartphone className="h-5 w-5" />;
      case "nagad":
        return <Smartphone className="h-5 w-5" />;
      case "cash":
        return <Banknote className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "sslcommerz":
        return "Credit/Debit Card";
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "cash":
        return "Cash/Offline";
      default:
        return method;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section className="pt-10 pb-14">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
              Make a Difference
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Support Our <span className="text-emerald-600">Community</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Your generosity helps us provide essential aid, support education,
              and build a stronger community. Every contribution, no matter the
              size, makes a real difference.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Shield className="h-4 w-4" />
                <span>Secure & Transparent</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <CheckCircle className="h-4 w-4" />
                <span>Tax Deductible</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <Heart className="h-4 w-4" />
                <span>100% to Community</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Donation Form */}
      <Section className="py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-white/80 dark:bg-emerald-900/40 p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Make Your Donation</h2>

              {/* Donation Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Donation Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "general", label: "General", icon: Heart },
                    { value: "zakat", label: "Zakat", icon: Target },
                    { value: "sadaqah", label: "Sadaqah", icon: HandCoins },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setDonationType(value as any)}
                      className={`p-4 rounded-xl border transition-all ${
                        donationType === value
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200"
                          : "border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-700/60"
                      }`}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Amount (BDT)
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedAmount === amount && !customAmount
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200"
                          : "border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-700/60"
                      }`}
                    >
                      ৳{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (e.target.value) setSelectedAmount(0);
                  }}
                  className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Project Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Choose Project (Optional)
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/40 px-4 py-3 outline-none focus:border-emerald-500"
                >
                  <option value="general">General Fund</option>
                  {projects
                    .filter((p) => p.status === "active")
                    .map((project) => (
                      <option key={project._id} value={project.slug}>
                        {project.title}
                      </option>
                    ))}
                </select>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "sslcommerz",
                      label: "Credit/Debit Card",
                      icon: CreditCard,
                    },
                    { value: "bkash", label: "bKash", icon: Smartphone },
                    { value: "nagad", label: "Nagad", icon: Smartphone },
                    { value: "cash", label: "Cash/Offline", icon: Banknote },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setPaymentMethod(value as any)}
                      className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                        paymentMethod === value
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200"
                          : "border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-700/60"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurring Donation */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium">
                    Make this a monthly recurring donation
                  </span>
                </label>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-xl ${
                    message.includes("successfully")
                      ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800/60"
                      : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/60"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                disabled={loading || (!selectedAmount && !customAmount)}
                className="w-full rounded-xl bg-emerald-600 text-white px-6 py-4 font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <HandCoins className="h-5 w-5" />
                    Donate Now
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Donation Summary */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5">
              <h3 className="text-lg font-bold mb-4">Donation Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{donationType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">
                    ৳
                    {(customAmount
                      ? parseFloat(customAmount) || 0
                      : selectedAmount
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-medium">
                    {getPaymentLabel(paymentMethod)}
                  </span>
                </div>
                {isRecurring && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Frequency:</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5">
              <h3 className="text-lg font-bold mb-4">Why Trust Us?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Secure Payments</div>
                    <div className="text-emerald-700/70 dark:text-emerald-200/70">
                      SSL encrypted transactions
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Transparent</div>
                    <div className="text-emerald-700/70 dark:text-emerald-200/70">
                      Monthly financial reports
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Community Focused</div>
                    <div className="text-emerald-700/70 dark:text-emerald-200/70">
                      100% goes to local causes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Impact */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-900/30 p-5">
              <h3 className="text-lg font-bold mb-4">Recent Impact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Families Helped:</span>
                  <span className="font-medium text-emerald-600">150+</span>
                </div>
                <div className="flex justify-between">
                  <span>Students Supported:</span>
                  <span className="font-medium text-emerald-600">45</span>
                </div>
                <div className="flex justify-between">
                  <span>Trees Planted:</span>
                  <span className="font-medium text-emerald-600">2,140</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Aid:</span>
                  <span className="font-medium text-emerald-600">
                    25 families
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="py-12">
        <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Questions About Donating?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            We're here to help. Contact us for any questions about donations,
            tax receipts, or how your contribution will be used.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold hover:bg-emerald-50 transition inline-flex items-center gap-2"
            >
              Contact Us
            </Link>
            <Link
              href="/reports"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              View Reports <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
