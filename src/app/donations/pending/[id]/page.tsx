"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Section from "@/components/Section";
import GeometricBg from "@/components/GeometricBg";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import { useLanguage } from "@/app/providers";

type DonationStatus =
  | "initiated"
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded";

type Donation = {
  _id: string;
  amount: number;
  currency: string;
  method: string;
  status: DonationStatus;
  createdAt: string;
  projectId?: { title: string; slug: string };
};

export default function DonationPendingPage() {
  const { t } = useLanguage();
  const params = useParams();
  const donationId = params.id as string;
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/donations/${donationId}`);

        if (response.ok) {
          const data = await response.json();
          setDonation(data.donation);
        } else {
          setError(t("donationPending.donationNotFound"));
        }
      } catch (err) {
        setError(t("donationPending.failedToLoadDetails"));
      } finally {
        setLoading(false);
      }
    };

    if (donationId) {
      fetchDonation();
    }
  }, [donationId]);

  const getStatusIcon = (status: DonationStatus) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />;
      case "pending":
      case "initiated":
        return <Clock className="h-16 w-16 text-amber-500" />;
      default:
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: DonationStatus) => {
    switch (status) {
      case "succeeded":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      case "pending":
      case "initiated":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  const getStatusMessage = (status: DonationStatus) => {
    switch (status) {
      case "succeeded":
        return t("donationPending.donationSuccessful");
      case "failed":
        return t("donationPending.donationFailed");
      case "pending":
        return t("donationPending.paymentPending");
      case "initiated":
        return t("donationPending.processingPayment");
      default:
        return t("donationPending.processing");
    }
  };

  const getStatusDescription = (status: DonationStatus) => {
    switch (status) {
      case "succeeded":
        return t("donationPending.thankYouMessage");
      case "failed":
        return t("donationPending.failedMessage");
      case "pending":
        return t("donationPending.pendingMessage");
      case "initiated":
        return t("donationPending.initiatedMessage");
      default:
        return t("donationPending.processingMessage");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900">
        <GeometricBg />
        <AnnouncementMarquee />

        <Section className="py-16">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <p className="text-emerald-700 dark:text-emerald-300">
                Loading donation details...
              </p>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900">
        <GeometricBg />
        <AnnouncementMarquee />

        <Section className="py-16">
          <div className="text-center py-16">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
              Donation Not Found
            </h1>
            <p className="text-emerald-700 dark:text-emerald-300 mb-6">
              {error || "The donation you're looking for could not be found."}
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Donate
            </Link>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900">
      <GeometricBg />
      <AnnouncementMarquee />

      <Section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              {getStatusIcon(donation.status)}
            </div>

            <h1
              className={`text-3xl font-bold mb-4 ${getStatusColor(
                donation.status
              )}`}
            >
              {getStatusMessage(donation.status)}
            </h1>

            <p className="text-lg text-emerald-700 dark:text-emerald-300 mb-8">
              {getStatusDescription(donation.status)}
            </p>

            <div className="bg-emerald-50 dark:bg-emerald-800/30 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                Donation Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-700 dark:text-emerald-300">
                    Amount:
                  </span>
                  <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {donation.amount.toLocaleString()} {donation.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700 dark:text-emerald-300">
                    Method:
                  </span>
                  <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {donation.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700 dark:text-emerald-300">
                    Status:
                  </span>
                  <span
                    className={`font-semibold ${getStatusColor(
                      donation.status
                    )}`}
                  >
                    {donation.status.charAt(0).toUpperCase() +
                      donation.status.slice(1)}
                  </span>
                </div>
                {donation.projectId && (
                  <div className="flex justify-between">
                    <span className="text-emerald-700 dark:text-emerald-300">
                      Project:
                    </span>
                    <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                      {donation.projectId.title}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-emerald-700 dark:text-emerald-300">
                    Date:
                  </span>
                  <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Donate
              </Link>
              <Link
                href="/projects"
                className="px-6 py-3 border border-emerald-300 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
              >
                View Projects
              </Link>
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
