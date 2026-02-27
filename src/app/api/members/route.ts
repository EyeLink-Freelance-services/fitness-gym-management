import { MemberCreateSchema } from "@/lib/validation/schemas/member";
import { createMember, listMembers } from "@/lib/db/queries/members";

export async function GET() {
  const members = await listMembers();
  return Response.json({ members });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = MemberCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const member = await createMember(parsed.data);
  return Response.json({ member }, { status: 201 });
}
