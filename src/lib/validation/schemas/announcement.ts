import { z } from "zod";

export const AnnouncementCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message must be at most 5000 characters"),
});

export type AnnouncementCreateInput = z.infer<typeof AnnouncementCreateSchema>;
