"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  membershipApplySchema,
  type MembershipApplyInput,
} from "@/lib/validators/membership";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

export default function MembershipApplyPage() {
  const { t } = useLanguage();
  const [submittedId, setSubmittedId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MembershipApplyInput>({
    resolver: zodResolver(membershipApplySchema),
  });

  const onSubmit = async (data: MembershipApplyInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/membership-requests", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();

      if (json.ok) {
        setSubmittedId(json.id);
        reset();
      } else {
        setError(
          typeof json.error === "string"
            ? json.error
            : t("membership.submissionFailed")
        );
      }
    } catch (err) {
      setError(t("membership.networkError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-emerald-950 dark:via-emerald-950/40 dark:to-emerald-950 text-emerald-950 dark:text-emerald-50">
      <GeometricBg />
      <AnnouncementMarquee />

      {/* Hero Section */}
      <Section id="membership-hero" className="pt-10 pb-14">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-wider text-emerald-700/80 dark:text-emerald-200/80">
              Join Our Community
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Request <span className="text-emerald-600">Membership</span>
            </h1>

            <p className="mt-4 text-emerald-800/80 dark:text-emerald-50/80 max-w-2xl mx-auto">
              Become a member of At-Taqwa Foundation and join our community of
              dedicated individuals working together for positive change.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <UserPlus className="h-4 w-4" />
                <span>Community Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <CheckCircle className="h-4 w-4" />
                <span>Admin Review</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <AlertCircle className="h-4 w-4" />
                <span>Quick Process</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Application Form */}
      <Section id="membership-form" className="py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              Membership Application
            </h2>
            <p className="text-emerald-700 dark:text-emerald-300">
              Fill out the form below to request membership. An admin will
              review your application and get back to you.
            </p>
          </div>

          {/* Success Message */}
          {submittedId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-800/50 border border-emerald-200 dark:border-emerald-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Your request ID:{" "}
                    <span className="font-mono">{submittedId}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Submission Failed
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder={t("membership.enterFullName")}
                className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                placeholder={t("membership.enterEmailAddress")}
                className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder={t("membership.enterPhoneNumber")}
                className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                {...register("phone")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                Additional Notes
              </label>
              <textarea
                rows={4}
                placeholder={t("membership.tellUsWhy")}
                className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
                {...register("notes")}
              />
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                Maximum 1000 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting Application...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Submit Membership Request
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-800/30 rounded-lg">
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
              <li>• Your application will be reviewed by our admin team</li>
              <li>• You'll receive an email notification about the decision</li>
              <li>• If approved, you'll gain access to member-only features</li>
              <li>• The review process typically takes 1-3 business days</li>
            </ul>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
