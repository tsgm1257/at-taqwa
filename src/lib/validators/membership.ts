import { z } from "zod";

export const membershipApplySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export type MembershipApplyInput = z.infer<typeof membershipApplySchema>;

export const membershipModerateSchema = z.object({
  action: z.enum(["approve", "deny"]),
  reason: z.string().max(500).optional(),
});
export type MembershipModerateInput = z.infer<typeof membershipModerateSchema>;
