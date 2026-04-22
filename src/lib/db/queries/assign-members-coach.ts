import { getServerDbClient } from "@/lib/db/server-client";
import { DietPlanAssignment, TrainingPlanAssignment } from "@/types/assignment-plan";

type AssignmentPayloadMap = {
  diet: DietPlanAssignment;
  training: TrainingPlanAssignment;
};

const ASSIGNMENT_TABLES = {
  training: {
    table: "training_plan_assignments",
    planColumn: "plan_id",
  },
  diet: {
    table: "diet_plan_assignments",
    planColumn: "diet_plan_id",
  },
} as const;

export type AssignmentType = keyof typeof ASSIGNMENT_TABLES;

type AssignableMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone?: string | null;
  isAlreadyAssigned: boolean;
  assignedAt: string | null;
  assignmentId: string | null;
};

export async function getMembersForPlanAssignment(
  type: AssignmentType,
  params: {
    companyId: string;
    assignedCoachId: string;
    planId: string;
    search?: string;
  }
) {
    const db = await getServerDbClient();
    const config = ASSIGNMENT_TABLES[type];

    let membersQuery = db
      .from("members")
      .select("id, first_name, last_name, email, phone")
      .eq("company_id", params.companyId)
      .eq("assigned_coach_id", params.assignedCoachId)
      .order("first_name", { ascending: true });

    if (params.search?.trim()) {
      const q = params.search.trim();
      membersQuery = membersQuery.or(
        `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`
      );
    }

    const { data: members, error: membersError } = await membersQuery;

    if (membersError) throw membersError;

    if (!members?.length) {
      return [];
    }

    const memberIds = members.map((m) => m.id);

    const { data: assignments, error: assignmentsError } = await db
      .from(config.table)
      .select("id, member_id, start_date")
      .eq("company_id", params.companyId)
      .eq(config.planColumn, params.planId)
      .in("member_id", memberIds);

    if (assignmentsError) throw assignmentsError;

    const assignmentMap = new Map(
      (assignments ?? []).map((item) => [item.member_id, item])
    );

    const result: AssignableMember[] = members.map((member) => {
      const assignment = assignmentMap.get(member.id);

      return {
        ...member,
        isAlreadyAssigned: Boolean(assignment),
        assignedAt: assignment?.start_date ?? null,
        assignmentId: assignment?.id ?? null,
      };
    });

    if (assignmentsError) throw assignmentsError;

    return result;
  }

export async function createAssignment<T extends AssignmentType>(
  type: T,
  payload: AssignmentPayloadMap[T] | AssignmentPayloadMap[T][]
) {
  const db = await getServerDbClient();

  const config = ASSIGNMENT_TABLES[type];

  const { data, error } = await db
    .from(config.table)
    .insert(payload)
    .select("*");

  if (error) throw error;
  return data;
}