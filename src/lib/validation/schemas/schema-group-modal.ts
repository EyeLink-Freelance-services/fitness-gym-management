import { z } from "zod";

export const schemaGroupModalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type SchemaGroupModalFormValues = z.infer<
  typeof schemaGroupModalFormSchema
>;
