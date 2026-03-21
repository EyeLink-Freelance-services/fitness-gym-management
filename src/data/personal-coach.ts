import * as Icons from "@/components/IconsCollection/icons";
import type {
  PersonalCoachAnnouncementRow,
  PersonalCoachMedicalNoteRow,
  PersonalCoachOverviewItem,
  PersonalCoachSessionRow,
} from "@/types/dashboard/personal-coach";

export const PERSONAL_COACH_OVERVIEW: PersonalCoachOverviewItem[] = [
  {
    label: "Total Clients",
    value: "4",
    trend: 2,
    icon: Icons.Users,
  },
  {
    label: "Today's Sessions",
    value: "4",
    trend: 3,
    icon: Icons.Calendar,
  },
  {
    label: "Active Progress",
    value: "2",
    trend: 1,
    icon: Icons.Product,
  },
  {
    label: "Monthly Earnings (Rs)",
    value: "9,450",
    trend: 12,
    icon: Icons.Profit,
  },
];

export const PERSONAL_COACH_TODAY_SESSIONS: PersonalCoachSessionRow[] = [
  {
    id: "session-1",
    dayLabel: "Today",
    clientName: "Wei Liang",
    sessionType: "Weight Loss",
    startsAt: "2026-03-11T08:00:00+08:00",
    durationMinutes: 60,
    status: "Done",
    statusTone: "success",
  },
  {
    id: "session-2",
    dayLabel: "Today",
    clientName: "Nurul Ain",
    sessionType: "HIIT",
    startsAt: "2026-03-11T10:00:00+08:00",
    durationMinutes: 45,
    status: "Now",
    statusTone: "warning",
  },
  {
    id: "session-3",
    dayLabel: "Tomorrow",
    clientName: "Elina Tan",
    sessionType: "Onboarding",
    startsAt: "2026-03-12T09:00:00+08:00",
    durationMinutes: 60,
    status: "Scheduled",
    statusTone: "primary",
  },
  {
    id: "session-4",
    dayLabel: "Tomorrow",
    clientName: "Marcus Lee",
    sessionType: "Endurance",
    startsAt: "2026-03-12T14:00:00+08:00",
    durationMinutes: 45,
    status: "Scheduled",
    statusTone: "primary",
  },
];

export const PERSONAL_COACH_MEDICAL_NOTES: PersonalCoachMedicalNoteRow[] = [
  {
    id: "note-1",
    clientName: "Wei Liang",
    note: "Knee injury",
    restriction: "No squats past 90 degrees; low-impact cardio only.",
    updatedAt: "2026-03-09",
    severity: "Monitor",
    severityTone: "warning",
  },
  {
    id: "note-2",
    clientName: "Nurul Ain",
    note: "Shoulder tightness",
    restriction: "Limit overhead pressing volume this week.",
    updatedAt: "2026-03-07",
    severity: "Moderate",
    severityTone: "warning",
  },
];

export const ANNOUNCEMENTS: PersonalCoachAnnouncementRow[] = [
  {
    id: "announcement-1",
    title: "Rate increase from 1 April",
    // audience: "Transformation program clients",
    publishAt: "2026-03-10",
    status: "Posted",
    statusTone: "success",
  },
  {
    id: "announcement-2",
    title: "Free nutrition workshop - 12 Mar",
    publishAt: "2026-03-09",
    status: "Posted",
    statusTone: "success",
  },
  {
    id: "announcement-3",
    title: "Form check video submission reminder",
    publishAt: "2026-03-12",
    status: "Scheduled",
    statusTone: "primary",
  },
];
