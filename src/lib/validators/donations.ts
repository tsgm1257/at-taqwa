import { z } from "zod";

export const donationInitSchema = z.object({
  amount: z.number().min(1, "Minimum 1 BDT"),
  currency: z.string().default("BDT"),
  method: z.enum(["sslcommerz", "bkash", "nagad"]), // integrate later
  projectSlug: z.string().optional(),
  note: z.string().max(300).optional(),
});
export type DonationInitInput = z.infer<typeof donationInitSchema>;

export const adminOfflineDonationSchema = z.object({
  email: z.string().email().optional(),   // Admin can specify user by email…
  userId: z.string().optional(),          // …or by userId
  amount: z.number().min(1),
  currency: z.string().default("BDT"),
  projectId: z.string().optional(),
  projectSlug: z.string().optional(),
  receiptUrl: z.string().url().optional(),
  note: z.string().max(300).optional(),
});
export type AdminOfflineDonationInput = z.infer<typeof adminOfflineDonationSchema>;
