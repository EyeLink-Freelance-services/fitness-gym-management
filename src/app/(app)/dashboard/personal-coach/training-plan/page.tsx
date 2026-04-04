import { ROUTES } from "@/constants/route";
import { redirect } from "next/navigation";

export default async function PersonalCoachTrainingPlanPage() {
  redirect(ROUTES.DASHBOARD.PERSONAL_COACH.CLIENTS);
}
