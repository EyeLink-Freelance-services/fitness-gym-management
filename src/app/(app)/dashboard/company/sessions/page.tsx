import { SessionSchedulingPage } from "@/components/Dashboard/session-scheduling";
import { getRoleFromAuthContext } from "@/config/routes.config";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getCompanyClientForCurrentUser } from "@/services/company/company.service";

export default async function CompanySessionsPage() {
  const auth = await getAuthContext();
  const role = getRoleFromAuthContext(auth);

  if (role === "client") {
    const client = await getCompanyClientForCurrentUser();

    return (
      <SessionSchedulingPage
        role="client"
        viewerClientId={client?.id}
      />
    );
  }

  const clientOptions = [
    { id: "client-demo-1", label: "Alex Rivera" },
    { id: "client-demo-2", label: "Jordan Lee" },
  ];

  return (
    <SessionSchedulingPage
      role="coach"
      coachId="coach-demo-1"
      clientOptions={clientOptions}
    />
  );
}
