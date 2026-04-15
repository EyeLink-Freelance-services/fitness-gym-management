import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { assertNoError } from "@/lib/db/errors";

// ─── Types ────────────────────────────────────────────────────────────────────
export type PersonalCoach = Database["public"]["Tables"]["personal_coaches"]["Row"];
export type PersonalCoachInsert = Database["public"]["Tables"]["personal_coaches"]["Insert"];
export type PersonalCoachUpdate = Database["public"]["Tables"]["personal_coaches"]["Update"];

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ─── Repository ───────────────────────────────────────────────────────────────

export const PersonalCoachRepository = {
  async insert(payload: PersonalCoachInsert): Promise<PersonalCoach> {
    const db = await supabaseServer();

    const { data, error } = await db
      .from("personal_coaches")
      .insert(payload)
      .select()
      .single();

    assertNoError(error, "PersonalCoachRepository.insert");

    return data!;
  },

  /**
   * Fetch all active personal coaches (respects soft-delete index on deleted_at)
   */
  async findAll(): Promise<any[]> {
    const db = await supabaseServer();

    const { data, error } = await db
      .from("personal_coaches")
      .select(
        `
      *
    `,
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    assertNoError(error, "PersonalCoachRepository.findAll");

    return data!;
  },

  async findSummary(page: number, pageSize: number): Promise<any> {
    const db = await supabaseServer();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await db
      .from("personal_coaches")
      .select("first_name, last_name, contact_number, coaching_mode, location")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    assertNoError(error, "PersonalCoachRepository.findPaginated");

    return data;
  },

  /**
   * Fetch a single personal coach by ID — returns null if not found
   */
  async findById(id: string) {
    const db = await supabaseServer();
  },

  /**
   * Paginated fetch with total count
   */
  async findPaginated(page: number, pageSize: number) {
    const db = await supabaseServer();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await db
      .from("personal_coaches")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    assertNoError(error, "PersonalCoachRepository.findPaginated");

    return {
      data: data!,
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    };
  },

  /**
   * Filtered fetch — all filters are optional
   */
  async findByFilters(filters: {}) {
    const db = await supabaseServer();
  },
};
