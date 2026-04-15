import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { assertNoError, DatabaseError } from "@/lib/db/errors";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ─── Repository ───────────────────────────────────────────────────────────────

export const CompanyRepository = {
  /**
   * Fetch all active companies (respects soft-delete index on deleted_at)
   */
  async findAll(): Promise<any[]> {
    const db = await supabaseServer();

    const { data, error } = await db
      .from("companies")
      .select(
        `
      *,
      company_branches (
        id,
        branch_name
      )
    `,
      )
      .is("deleted_at", null)
      .is("company_branches.deleted_at", null)
      .order("created_at", { ascending: false });

    assertNoError(error, "CompanyRepository.findAll");

    return data!;
  },

  async findSummary(page: number, pageSize: number): Promise<any> {
    const db = await supabaseServer();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await db
      .from("companies")
      .select("name, contact_phone, brn, address")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    assertNoError(error, "CompanyRepository.findPaginated");

    return data;
  },

  /**
   * Fetch a single company by ID — returns null if not found
   */
  async findById(id: string): Promise<Company | null> {
    const db = await supabaseServer();

    const { data, error } = await db
      .from("companies")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) {
      const dbError = new DatabaseError(error, "CompanyRepository.findById");
      if (dbError.isNotFound) return null;
      throw dbError;
    }

    return data;
  },

  /**
   * Paginated fetch with total count
   */
  async findPaginated(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Company>> {
    const db = await supabaseServer();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await db
      .from("companies")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    assertNoError(error, "CompanyRepository.findPaginated");

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
  async findByFilters(filters: {
    mode?: string;
    city?: string;
    region?: string;
  }): Promise<Company[]> {
    const db = await supabaseServer();

    let query = db
      .from("companies")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (filters.mode) query = query.eq("mode", filters.mode);
    if (filters.city) query = query.eq("city", filters.city);
    if (filters.region) query = query.eq("region", filters.region);

    const { data, error } = await query;
    assertNoError(error, "CompanyRepository.findByFilters");
    return data!;
  },
};
