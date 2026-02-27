import { MemberUpdateSchema } from "@/lib/validation/schemas/member";
import { deleteMember, getMember, updateMember } from "@/lib/db/queries/members";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const member = await getMember(id);
  if (!member) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ member });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const parsed = MemberUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const member = await updateMember(id, parsed.data);
  return Response.json({ member });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  await deleteMember(id);
  return Response.json({ ok: true });
}
