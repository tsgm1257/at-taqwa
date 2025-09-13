import { z } from "zod";

const lineItem = z.object({
  category: z.string().min(1),
  amount: z.number().min(0),
  note: z.string().max(500).optional(),
});

export const reportCreateSchema = z.object({
  title: z.string().min(3, "Title required"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM"),
  currency: z.string().default("BDT"),

  openingBalance: z.number().min(0).default(0),

  income: z.array(lineItem).default([]),
  expense: z.array(lineItem).default([]),

  summary: z.string().max(1000).optional(),
  published: z.boolean().optional(),
});
export type ReportCreateInput = z.infer<typeof reportCreateSchema>;

export const reportUpdateSchema = reportCreateSchema.partial();
export type ReportUpdateInput = z.infer<typeof reportUpdateSchema>;
