import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getDefaultRouteFromAuthContext, getRoleFromAuthContext } from "@/config/routes.config";
import { ROUTES } from "@/constants/route";

export default async function PersonalCoachDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getAuthContext();
  const role = getRoleFromAuthContext(auth);

  if (role !== "personal-coach") {
    redirect(getDefaultRouteFromAuthContext(auth) ?? ROUTES.LOGIN);
  }

  return <>{children}</>;
}
