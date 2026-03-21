import { z } from "zod";

export const AnnouncementSendType = z.enum(["now", "schedule"]);

export const AnnouncementCreateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be at most 200 characters"),
    audience: z.string().min(1, "Audience is required"),
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(5000, "Message must be at most 5000 characters"),
    sendType: AnnouncementSendType,
    scheduledDate: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.sendType === "schedule") {
      if (!data.scheduledDate || String(data.scheduledDate).trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Scheduled date is required when scheduling",
          path: ["scheduledDate"],
        });
        return;
      }
      const date = new Date(data.scheduledDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      if (date <= now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Scheduled date must be in the future",
          path: ["scheduledDate"],
        });
      }
    }
  });

export type AnnouncementCreateInput = z.infer<typeof AnnouncementCreateSchema>;
