import { MemberCreateSchema } from "@/lib/validation/schemas/member";
import { createMember, listMembers } from "@/lib/db/queries/members";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const members = await listMembers();
    return NextResponse.json({ok: true,  data: members });
  } catch (err: any) {  
    console.log(err, 'get member error')
    return NextResponse.json({ ok: false,  message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
  
    const parsed = MemberCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {ok: false,  message: "Invalid payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }
  
    const member = await createMember(parsed.data);
    return NextResponse.json({ok: true,  data: member }, { status: 201 });

  } catch(err: any) {
    console.log(err, 'create member error')
    return NextResponse.json({ ok: false,  message: err.message }, { status: 500 });
  }
}
