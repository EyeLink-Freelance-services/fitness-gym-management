"use client";

import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { cn } from "@/lib/utils";
import type { CoachClient } from "@/types/dashboard/client-records";
import {
  PersonalCoachMedicalNoteRow,
} from "@/types/dashboard/personal-coach";
import { TableUIColumn } from "@/types/shared";
import { getProgressBarClassName } from "@/utils/dashboard/shared";
import { ColumnDef } from "@tanstack/react-table";

export const clientProgressColumns: TableUIColumn<CoachClient>[] = [
  {
    key: "name",
    label: "Client",
    align: "left",
    headClassName: "min-w-[170px]",
  },
  {
    key: "goal",
    label: "Goal",
    align: "left",
    headClassName: "min-w-[130px]",
  },
  {
    key: "progress",
    label: "Progress",
    render: (row) => {
      const progress = row.progress ?? 0;
      return (
        <div className="flex items-center gap-3">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-dark-2 dark:bg-dark-3">
            <div
              className={cn(
                "h-full rounded-full",
                getProgressBarClassName(progress),
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-dark dark:text-white">
            {progress}%
          </span>
        </div>
      );
    },
    headClassName: "min-w-[170px]",
  },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex justify-center gap-2">
          <Button
            label="Plan"
            size="small"
            variant="outlineDark"
            className="px-4 py-2"
            toastMessage="Training plan page not yet created"
          />
          <Button
            label="Diet"
            size="small"
            variant="outlineDark"
            className="px-4 py-2"
            toastMessage="Diet plan page not yet created"
          />
        </div>
      ),
      headClassName: "min-w-[170px]",
    },
  ];

export const medicalNoteColumns: ColumnDef<PersonalCoachMedicalNoteRow>[] = [
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {row.original.clientName}
      </span>
    ),
    meta: {
      align: "left",
      headClassName: "min-w-[150px]",
    },
  },
  {
    accessorKey: "note",
    header: "Condition",
    meta: {
      align: "left",
      headClassName: "min-w-[150px]",
    },
  },
  {
    accessorKey: "restriction",
    header: "Restriction",
    meta: {
      align: "left",
      headClassName: "min-w-[240px]",
    },
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.severity}
        tone={row.original.severityTone}
      />
    ),
  },
];