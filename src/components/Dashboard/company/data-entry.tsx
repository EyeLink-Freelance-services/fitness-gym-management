"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveCompanyClientRecordDraftAction } from "@/app/(app)/dashboard/company/clients/client-data-entry-actions";
import { DataEntryWorkspace } from "@/components/Dashboard/client-records/data-entry-workspace";
import { ROUTES } from "@/constants/route";
import type { ClientRecordDraft } from "@/types/dashboard/client-records";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";

type CompanyDataEntryProps = {
  clientId: string;
  draft: ClientRecordDraft;
  formulas: FormulaDefinition[];
};

export function CompanyDataEntry({
  clientId,
  draft,
  formulas,
}: CompanyDataEntryProps) {
  const router = useRouter();

  const handleSave = async (input: {
    values: Record<string, string>;
    notes: string;
    sessionDate: string;
  }) => {
    try {
      await saveCompanyClientRecordDraftAction(clientId, input);
      toast.success("Client record saved.");
      router.refresh();
    } catch {
      toast.error("Unable to save client record.");
      throw new Error("Unable to save client record.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-dark-6">
        <Link
          href={ROUTES.DASHBOARD.COMPANY.CLIENTS}
          className="hover:text-primary"
        >
          Clients
        </Link>
        <span>/</span>
        <Link
          href={ROUTES.DASHBOARD.COMPANY.CLIENT_PROFILE(clientId)}
          className="hover:text-primary"
        >
          {draft.clientName}
        </Link>
        <span>/</span>
        <span className="text-dark dark:text-white">Data Entry</span>
      </div>

      <DataEntryWorkspace draft={draft} formulas={formulas} onSave={handleSave} />
    </div>
  );
}
