import Link from "next/link";
import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";

type ClientCoachingActionsProps = {
  clientId: string;
};

export function ClientCoachingActions({ clientId }: ClientCoachingActionsProps) {
  return (
    <Link href={`${ROUTES.DASHBOARD.COMPANY.DATA_ENTRY}?clientId=${clientId}`}>
      <Button label="Data Entry" size="small" />
    </Link>
  );
}
