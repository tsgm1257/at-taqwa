import { z } from "zod";

export const genFeesSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM"),
  amount: z.number().min(0),
  roles: z.array(z.enum(["Admin", "Member"])).nonempty(),
});

export type GenFeesInput = z.infer<typeof genFeesSchema>;

export const adminFeeUpdateSchema = z.object({
  status: z.enum(["unpaid", "partial", "paid", "waived"]).optional(),
  amount: z.number().min(0).optional(),
  paidAt: z.string().datetime().optional(), // ISO
  notes: z.string().max(500).optional(),
});

export type AdminFeeUpdateInput = z.infer<typeof adminFeeUpdateSchema>;
