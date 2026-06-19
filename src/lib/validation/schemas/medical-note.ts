import { z } from "zod";

export const MedicalNoteSeverity = z.enum(["high", "moderate", "low"]);

export const MedicalNoteCreateSchema = z.object({
  clientId: z
    .string()
    .trim()
    .min(1, "Client is required"),
  condition: z
    .string()
    .trim()
    .min(1, "Condition is required")
    .max(500, "Condition must be at most 500 characters"),
  restrictionNotes: z
    .string()
    .trim()
    .min(1, "Restriction notes are required")
    .max(2000, "Restriction notes must be at most 2000 characters"),
  severity: MedicalNoteSeverity,
});

export type MedicalNoteCreateInput = z.infer<typeof MedicalNoteCreateSchema>;
