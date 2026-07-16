import { z } from "zod";

export const AnnouncementCreateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(255, "Title must be at most 255 characters"),
    content: z
      .string()
      .trim()
      .max(2000, "Content must be at most 2000 characters")
      .optional()
      .or(z.literal("")),
    noticeType: z.enum(["ANNOUNCEMENT", "EVENT"], {
      message: "Type is required",
    }),
    eventDateTime: z.string().optional().or(z.literal("")),
    expiresAt: z.string().optional().or(z.literal("")),
  })
  .superRefine((values, ctx) => {
    if (values.noticeType === "EVENT" && !values.eventDateTime?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event date & time is required for events",
        path: ["eventDateTime"],
      });
    }
  });

export type AnnouncementCreateInput = z.infer<typeof AnnouncementCreateSchema>;
