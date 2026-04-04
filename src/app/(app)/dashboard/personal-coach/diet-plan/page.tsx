import { ROUTES } from "@/constants/route";
import { redirect } from "next/navigation";

export default async function PersonalCoachDietPlanPage() {
  redirect(ROUTES.DASHBOARD.PERSONAL_COACH.CLIENTS);
}
