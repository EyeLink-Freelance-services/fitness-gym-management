"use server";

import { getPersonalCoachClients } from "@/services/coach-schema.services";

export async function getPersonalCoachClientsAction() {
  try {
    const clients = await getPersonalCoachClients();
    return { ok: true, data: clients };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to load clients",
    };
  }
}
