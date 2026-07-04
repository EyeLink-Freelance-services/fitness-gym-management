"use client";

import { useRouter } from "next/navigation";
import { saveClientMetricValuesAction } from "@/app/(app)/dashboard/company/clients/[clientId]/data-entry/actions";
import { DataEntryWorkspace } from "@/components/Dashboard/client-records/data-entry-workspace";
import { useSyncedState } from "@/hooks/use-synced-state";
import type {
  ClientMetricValueDraft,
  SearchClientMetricValueResponseBody,
} from "@/types/dashboard/client-metric-value";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";

type CompanyDataEntryProps = {
  draft: ClientMetricValueDraft;
  formulas: FormulaDefinition[];
  metricValues: SearchClientMetricValueResponseBody;
};

export function CompanyDataEntry({
  draft: initialDraft,
  formulas,
  metricValues: initialMetricValues,
}: CompanyDataEntryProps) {
  const router = useRouter();
  const [draft, setDraft] = useSyncedState(initialDraft);
  const [metricValues, setMetricValues] = useSyncedState(initialMetricValues);

  return (
    <div>
      <DataEntryWorkspace
        draft={draft}
        formulas={formulas}
        onSave={async ({ values }) => {
          const saved = await saveClientMetricValuesAction(draft.clientId, {
            values,
            originalValues: draft.values,
            fieldMeta: draft.fieldMeta,
          });
          setDraft(saved.draft);
          setMetricValues(saved.metricValues);
          router.refresh();
        }}
      />
    </div>
  );
}
