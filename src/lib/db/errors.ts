import type { PostgrestError } from "@supabase/supabase-js";

export class DatabaseError extends Error {
  constructor(
    public readonly error: PostgrestError,
    public readonly context?: string
  ) {
    super(`[${context ?? "DB"}] ${error.message} (code: ${error.code})`);
    this.name = "DatabaseError";
  }

  get isNotFound() {
    return this.error.code === "PGRST116";
  }
}

export function assertNoError(error: PostgrestError | null, context?: string) {
  if (error) throw new DatabaseError(error, context);
}