import { z } from "zod";

export const MemberCreateSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")).transform(v => v || undefined),
  phone: z.string().optional().or(z.literal("")).transform(v => v || undefined),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const MemberUpdateSchema = MemberCreateSchema.partial();

export type MemberCreateInput = z.infer<typeof MemberCreateSchema>;
export type MemberUpdateInput = z.infer<typeof MemberUpdateSchema>;
