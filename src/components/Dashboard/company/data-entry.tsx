"use client";

import { useRouter } from "next/navigation";
import { saveClientMetricValuesAction } from "@/app/(app)/dashboard/company/clients/[clientId]/data-entry/actions";
import { DataEntryWorkspace } from "@/components/Dashboard/client-records/data-entry-workspace";
import type { ClientMetricValueDraft } from "@/types/dashboard/client-metric-value";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";

type CompanyDataEntryProps = {
  draft: ClientMetricValueDraft;
  formulas: FormulaDefinition[];
};

export function CompanyDataEntry({ draft, formulas }: CompanyDataEntryProps) {
  const router = useRouter();

  return (
    <div>
      <DataEntryWorkspace
        draft={draft}
        formulas={formulas}
        onSave={async ({ values }) => {
          await saveClientMetricValuesAction(draft.clientId, {
            values,
            originalValues: draft.values,
            fieldMeta: draft.fieldMeta,
          });
          router.refresh();
        }}
      />
    </div>
  );
}
