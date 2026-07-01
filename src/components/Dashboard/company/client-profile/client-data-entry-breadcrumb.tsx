import Link from "next/link";
import { ROUTES } from "@/constants/route";

type ClientDataEntryBreadcrumbProps = {
  clientId: string;
  clientName: string;
};

export function ClientDataEntryBreadcrumb({
  clientId,
  clientName,
}: ClientDataEntryBreadcrumbProps) {
  return (
    <nav
      className="mb-6 flex items-center gap-2 text-sm text-dark-6"
      aria-label="Breadcrumb"
    >
      <Link
        href={ROUTES.DASHBOARD.COMPANY.CLIENTS}
        className="transition-colors hover:text-primary"
      >
        Clients
      </Link>
      <span aria-hidden>/</span>
      <Link
        href={ROUTES.DASHBOARD.COMPANY.CLIENT_PROFILE(clientId)}
        className="transition-colors hover:text-primary"
      >
        {clientName}
      </Link>
      <span aria-hidden>/</span>
      <span className="font-medium text-dark dark:text-white">Data Entry</span>
    </nav>
  );
}
