"use server";

import { createPersonalCoachService } from "@/modules/personal-coach/personal-coach.service";
import { PersonalCoachFormData } from "@/types/forms";

export async function createPersonalCoachAction(data: PersonalCoachFormData) {
  return await createPersonalCoachService(data);
}
