import { SessionSchedulingPage } from "@/components/Dashboard/session-scheduling";
import { getRoleFromAuthContext } from "@/config/routes.config";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getCompanyClientFullName } from "@/modules/company/company-client.mappers";
import {
  getCompanyClientForCurrentUser,
  getCompanyClients,
} from "@/services/company/company.service";
import { getTrainingSessions } from "@/services/company/training-session.service";

export default async function CompanySessionsPage() {
  const auth = await getAuthContext();
  const role = getRoleFromAuthContext(auth);
  const initialSessions = await getTrainingSessions();

  if (role === "client") {
    const client = await getCompanyClientForCurrentUser();

    return (
      <SessionSchedulingPage
        role="client"
        viewerClientId={client?.id}
        initialSessions={initialSessions}
      />
    );
  }

  const { clients } = await getCompanyClients({ pageSize: 100 });
  const clientOptions = clients.map((client) => ({
    id: client.id,
    label: getCompanyClientFullName(client),
  }));

  return (
    <SessionSchedulingPage
      role="coach"
      clientOptions={clientOptions}
      initialSessions={initialSessions}
    />
  );
}
