import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/route";

export default function PersonalCoachProgressPage() {
  redirect(ROUTES.DASHBOARD.PERSONAL_COACH.CLIENTS);
}
