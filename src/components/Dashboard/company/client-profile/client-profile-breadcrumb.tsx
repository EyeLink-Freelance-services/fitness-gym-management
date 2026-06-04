import Link from "next/link";
import { ROUTES } from "@/constants/route";

export function ClientProfileBreadcrumb({ clientName }: { clientName: string }) {
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
      <span className="font-medium text-dark dark:text-white">{clientName}</span>
    </nav>
  );
}
