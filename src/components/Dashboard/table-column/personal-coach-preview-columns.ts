import {
  ClientBodyMeasurementRow,
  ClientMealPlanRow,
  ClientUpcomingSessionRow,
  ClientWorkoutPlanRow,
} from "@/types/dashboard/client";
import type { CoachClient } from "@/types/dashboard/client-records";
import { PersonalCoachAnnouncementRow } from "@/types/dashboard/personal-coach";
import type { TableUIColumn } from "@/types/shared";
import { formatDate } from "@/utils/dashboard/shared";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const clientProgressPreviewColumns: TableUIColumn<CoachClient>[] = [
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
    headClassName: "min-w-[170px]",
  },
  {
    key: "status",
    label: "Status",
    align: "left",
    headClassName: "min-w-[120px]",
  },
  {
    key: "plan",
    label: "PLan",
    align: "left",
    headClassName: "min-w-[100px]",
  },
  {
    key: "progress",
    label: "Progress",
    render: (row) => `${row.progress ?? 0}%`,
    headClassName: "min-w-[170px]",
  },
];

export const announcementColumns: TableUIColumn<PersonalCoachAnnouncementRow>[] =
  [
    {
      key: "title",
      label: "Announcement",
      align: "left",
      headClassName: "min-w-[240px]",
    },
    {
      key: "audience",
      label: "Audience",
      align: "left",
      headClassName: "min-w-[140px]",
    },
    {
      key: "publishAt",
      label: "Publish Date",
      render: (row) => formatDate(row.publishAt),
      headClassName: "min-w-[140px]",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => row.status,
      headClassName: "min-w-[120px]",
    },
  ];

export const upcomingSessionColumns: TableUIColumn<ClientUpcomingSessionRow>[] =
  [
    {
      key: "session",
      label: "Session",
      align: "left",
      render: (row) => row.session,
      headClassName: "min-w-[180px]",
    },
    {
      key: "coach",
      label: "Coach Name",
      align: "left",
      render: (row) => row.coachName,
      headClassName: "min-w-[130px]",
    },
    {
      key: "startsAt",
      label: "Date",
      render: (row) => formatDate(row.startsAt),
      headClassName: "min-w-[130px]",
    },
    {
      key: "time",
      label: "Time",
      render: (row) => formatTime(row.startsAt),
      headClassName: "min-w-[110px]",
    },
    {
      key: "durationMinutes",
      label: "Duration",
      render: (row) => `${row.durationMinutes} min`,
      headClassName: "min-w-[110px]",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => row.status,
      headClassName: "min-w-[120px]",
    },
  ];

export const bodyMeasurementColumns: TableUIColumn<ClientBodyMeasurementRow>[] =
  [
    {
      key: "metric",
      label: "Metric",
      align: "left",
      headClassName: "min-w-[150px]",
    },
    {
      key: "value",
      label: "Current",
      headClassName: "min-w-[110px]",
    },
    {
      key: "change",
      label: "Change",
      render: (row) => row.change,
      headClassName: "min-w-[110px]",
    },
    {
      key: "lastUpdated",
      label: "Updated",
      render: (row) => formatDate(row.lastUpdated),
      headClassName: "min-w-[130px]",
    },
  ];

export const workoutPlanColumns: TableUIColumn<ClientWorkoutPlanRow>[] = [
  {
    key: "day",
    label: "Day",
    align: "left",
    headClassName: "min-w-[120px]",
  },
  {
    key: "focus",
    label: "Training Focus",
    align: "left",
    render: (row) => row.focus,
    headClassName: "min-w-[260px]",
  },
  {
    key: "exercise",
    label: "Exercise",
    align: "left",
    render: (row) => row.exercises,
    headClassName: "min-w-[260px]",
  },
  {
    key: "duration",
    label: "Duration",
    headClassName: "min-w-[110px]",
  },
  {
    key: "volume",
    label: "Volume",
    headClassName: "min-w-[140px]",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => row.status,
    headClassName: "min-w-[120px]",
  },
];

export const mealPlanColumns: TableUIColumn<ClientMealPlanRow>[] = [
  {
    key: "meal",
    label: "Meal",
    align: "left",
    headClassName: "min-w-[150px]",
  },
  {
    key: "time",
    label: "Time",
    align: "left",
    headClassName: "min-w-[150px]",
  },
  {
    key: "items",
    label: "Items",
    align: "left",
    headClassName: "min-w-[280px]",
  },
  {
    key: "macros",
    label: "Macros",
    headClassName: "min-w-[120px]",
  },
  {
    key: "calories",
    label: "Calories",
    headClassName: "min-w-[120px]",
  },
];
