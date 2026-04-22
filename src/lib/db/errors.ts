type DbErrorLike = {
  message: string;
  code?: string | null;
};

export class DatabaseError extends Error {
  constructor(
    public readonly error: DbErrorLike,
    public readonly context?: string
  ) {
    super(`[${context ?? "DB"}] ${error.message} (code: ${error.code ?? "n/a"})`);
    this.name = "DatabaseError";
  }

  get isNotFound() {
    return this.error.code === "PGRST116";
  }
}

export function assertNoError(error: DbErrorLike | null, context?: string) {
  if (error) throw new DatabaseError(error, context);
}