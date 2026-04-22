import { NextRequest, NextResponse } from "next/server";

export type RouteAuthClient = any;

export async function getRouteAuthClient(
  _req: NextRequest,
  _res: NextResponse,
): Promise<RouteAuthClient> {
  throw new Error("Route auth client is not configured yet.");
}
