import { z } from "zod";

export const projectCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  targetAmount: z.number().min(0),
  category: z.string().min(1),
  image: z.string().url().optional().or(z.literal("")),
  status: z.enum(["active", "completed", "paused"]).optional(),
  startDate: z.string().min(1), // Date strings from form inputs
  endDate: z.string().optional().or(z.literal("")),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export const announcementCreateSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(5),
  pinned: z.boolean().optional(),
  marquee: z.boolean().optional(),
  visibleTo: z.enum(["all", "members", "admins"]).default("all"),
  publishedAt: z.string().datetime().optional(),
});

export const announcementUpdateSchema = announcementCreateSchema.partial();

export type AnnouncementCreateInput = z.infer<typeof announcementCreateSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;
