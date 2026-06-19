import { z } from "zod";

export const metricDefinitionModalFormSchema = z.object({
  label: z.string().trim().min(1, "Field label is required"),
  unit: z.string().trim().min(1, "Unit is required"),
  group: z.string().trim().min(1, "Group is required"),
});

export type MetricDefinitionModalFormValues = z.infer<
  typeof metricDefinitionModalFormSchema
>;
