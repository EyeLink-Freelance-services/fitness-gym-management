import { SessionSchedulingPage } from "@/components/Dashboard/session-scheduling";

export default function PersonalCoachSessionsPage() {
  // TODO: replace with backend/auth data
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
