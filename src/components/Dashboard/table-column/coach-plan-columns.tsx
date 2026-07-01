import type {
  ClientDietPlanRow,
  ClientTrainingPlanRow,
  ClientTrainingSessionRow,
  CoachDietPlanRow,
  CoachTrainingPlanRow,
} from "@/types/dashboard/client";
import {
  formatDietUpdatedAt,
  formatMealIntervalLabel,
} from "@/modules/company/client-diet.mappers";
import { formatTrainingUpdatedAt } from "@/modules/company/client-training.mappers";
import type { ColumnDef } from "@tanstack/react-table";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const clientDietPlanColumns: ColumnDef<ClientDietPlanRow>[] = [
  {
    id: "mealTime",
    header: "Meal Time",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {formatMealIntervalLabel(
          row.original.mealInterval,
          row.original.mealTime,
        )}
      </span>
    ),
    meta: {
      align: "left",
      headClassName: "min-w-[160px]",
    },
  },
  {
    accessorKey: "mealDescription",
    header: "Meal Description",
    meta: {
      align: "left",
      headClassName: "min-w-[240px]",
    },
  },
  {
    id: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => formatDietUpdatedAt(row.original.updatedAt),
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
];

export const coachDietPlanColumns: ColumnDef<CoachDietPlanRow>[] = [
  {
    accessorKey: "clientName",
    header: "Client",
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
  {
    accessorKey: "mealsSummary",
    header: "Meals",
    meta: {
      align: "left",
      headClassName: "min-w-[320px]",
    },
  },
  {
    accessorKey: "totalMeals",
    header: "Total",
    meta: {
      headClassName: "min-w-[100px]",
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => formatDate(row.original.updatedAt),
    meta: {
      headClassName: "min-w-[140px]",
    },
  },
];

export const clientTrainingPlanColumns: ColumnDef<ClientTrainingPlanRow>[] = [
  {
    accessorKey: "day",
    header: "Day",
    meta: {
      align: "left",
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "trainingActivity",
    header: "Training Activity",
    cell: ({ row }) => (
      <span className="text-dark dark:text-white">
        {row.original.trainingActivity}
      </span>
    ),
    meta: {
      align: "left",
      headClassName: "min-w-[240px]",
    },
  },
  {
    id: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => formatTrainingUpdatedAt(row.original.updatedAt),
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
];

export const clientTrainingSessionColumns: ColumnDef<ClientTrainingSessionRow>[] =
  [
    {
      accessorKey: "coachName",
      header: "Coach",
      meta: {
        align: "left",
        headClassName: "min-w-[160px]",
      },
    },
    {
      accessorKey: "sessionTitle",
      header: "Session Title",
      cell: ({ row }) => (
        <span className="text-dark dark:text-white">
          {row.original.sessionTitle}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[200px]",
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => formatDate(`${row.original.date}T12:00:00`),
      meta: {
        align: "left",
        headClassName: "min-w-[140px]",
      },
    },
    {
      accessorKey: "timeFrom",
      header: "Time From",
      meta: {
        align: "left",
        headClassName: "min-w-[120px]",
      },
    },
    {
      accessorKey: "timeTo",
      header: "Time To",
      meta: {
        align: "left",
        headClassName: "min-w-[120px]",
      },
    },
  ];

export const coachTrainingPlanColumns: ColumnDef<CoachTrainingPlanRow>[] = [
  {
    accessorKey: "clientName",
    header: "Client",
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
  {
    accessorKey: "monday",
    header: "Mon",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "tuesday",
    header: "Tue",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "wednesday",
    header: "Wed",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "thursday",
    header: "Thu",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "friday",
    header: "Fri",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "saturday",
    header: "Sat",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "sunday",
    header: "Sun",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "repeats",
    header: "Repeats",
    meta: { headClassName: "min-w-[120px]" },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => formatDate(row.original.updatedAt),
    meta: { headClassName: "min-w-[140px]" },
  },
];
