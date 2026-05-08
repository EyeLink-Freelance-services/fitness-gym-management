import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getDefaultRouteFromAuthContext, getRoleFromAuthContext } from "@/config/routes.config";
import { ROUTES } from "@/constants/route";

export default async function CompanyDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getAuthContext();
  const role = getRoleFromAuthContext(auth);
  const isCompanyRole = role === "company" || role === "company-coach";

  if (!isCompanyRole) {
    redirect(getDefaultRouteFromAuthContext(auth) ?? ROUTES.LOGIN);
  }

  return <>{children}</>;
}
