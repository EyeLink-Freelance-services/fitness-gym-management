export type ServerDbClient = any;

export async function getServerDbClient(): Promise<ServerDbClient> {
  throw new Error("Database client is not configured yet.");
}
