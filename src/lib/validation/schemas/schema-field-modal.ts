import { z } from "zod";

const dropdownOptionRowSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const schemaFieldModalFormSchema = z
  .object({
    label: z.string().min(1, "Label is required"),
    type: z.enum(["number", "text", "dropdown"] as const),
    unit: z.string().optional(),
    min: z.string().optional(),
    max: z.string().optional(),
    groupId: z.string().min(1, "Select a group"),
    options: z.array(dropdownOptionRowSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "number") {
      const minN = data.min?.trim() ? Number(data.min) : undefined;
      const maxN = data.max?.trim() ? Number(data.max) : undefined;
      if (data.min?.trim() && Number.isNaN(minN)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["min"],
          message: "Enter a valid number",
        });
      }
      if (data.max?.trim() && Number.isNaN(maxN)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["max"],
          message: "Enter a valid number",
        });
      }
      if (
        minN !== undefined &&
        maxN !== undefined &&
        !Number.isNaN(minN) &&
        !Number.isNaN(maxN) &&
        minN > maxN
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["max"],
          message: "Must be greater than or equal to min",
        });
      }
    }

    if (data.type === "dropdown") {
      const rows = data.options ?? [];
      const filled = rows.filter(
        (r) => r.label.trim().length > 0 && r.value.trim().length > 0,
      );
      if (filled.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Add at least one option with a label and value",
        });
        return;
      }
      const vals = filled.map((r) => r.value.trim());
      if (new Set(vals).size !== vals.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Each option value must be unique",
        });
      }
    }
  });

export type SchemaFieldModalFormValues = z.infer<
  typeof schemaFieldModalFormSchema
>;
