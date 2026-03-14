"use client";

import { DataTable } from "@/components/Tables/data-table";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import type { ClientRecordRow } from "@/types/dashboard/client-records";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type ProgressRecordsTableProps = {
  records: ClientRecordRow[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function ProgressRecordsTable({ records }: ProgressRecordsTableProps) {
  const columns = useMemo<ColumnDef<ClientRecordRow>[]>(
    () => [
      {
        accessorKey: "sessionDate",
        header: "Date",
        cell: ({ row }) => formatDate(row.original.sessionDate),
        meta: { align: "left" },
      },
      {
        accessorKey: "weight",
        header: "Weight",
        cell: ({ row }) => row.original.weight.toFixed(1),
      },
      {
        accessorKey: "bmi",
        header: "BMI",
        cell: ({ row }) => row.original.bmi.toFixed(1),
      },
      {
        accessorKey: "bodyFat",
        header: "Body Fat %",
        cell: ({ row }) => row.original.bodyFat.toFixed(1),
      },
      {
        accessorKey: "fatMass",
        header: "Fat Mass",
        cell: ({ row }) => row.original.fatMass.toFixed(1),
      },
      {
        accessorKey: "leanMass",
        header: "Lean Mass",
        cell: ({ row }) => row.original.leanMass.toFixed(1),
      },
      {
        accessorKey: "bmr",
        header: "BMR",
      },
      {
        accessorKey: "tdee",
        header: "TDEE",
      },
      {
        id: "delta",
        header: "Δ Fat",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusBadge
              label={`${row.original.fatDelta > 0 ? "+" : ""}${row.original.fatDelta.toFixed(1)}`}
              tone={row.original.fatDelta <= 0 ? "success" : "warning"}
            />
          </div>
        ),
      },
      {
        id: "view",
        header: "",
        cell: () => (
          <button
            type="button"
            className="rounded-[8px] border border-dark-3 px-3 py-1.5 text-xs font-medium text-dark-6 hover:border-primary hover:text-primary dark:text-dark-5"
          >
            View
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      title="All Records"
      description="Snapshot of computed outputs saved for each coaching session."
      data={records}
      columns={columns}
      initialPageSize={8}
      getRowId={(row) => row.id}
      tableClassName="min-w-[940px]"
      showFooter={false}
    />
  );
}
