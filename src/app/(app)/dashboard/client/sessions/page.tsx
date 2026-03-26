import { SessionSchedulingPage } from "@/components/Dashboard/session-scheduling";

type ClientSessionsPageProps = {
  searchParams?: Promise<{
    clientId?: string;
  }>;
};

export default async function ClientSessionsPage({
  searchParams,
}: ClientSessionsPageProps) {
  const params = await searchParams;

  // TODO: replace with backend/auth data
  return (
    <SessionSchedulingPage
      role="client"
      viewerClientId={params?.clientId}
    />
  );
}
