import * as Icons from "@/components/IconsCollection/icons";
import type {
  PersonalCoachAnnouncementRow,
  PersonalCoachClientProgressRow,
  PersonalCoachMedicalNoteRow,
  PersonalCoachOverviewItem,
  PersonalCoachProgressSeries,
  PersonalCoachSessionRow,
} from "@/types/dashboard/personal-coach";

export const PERSONAL_COACH_OVERVIEW: PersonalCoachOverviewItem[] = [
  {
    label: "Total Clients",
    value: "21",
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
    value: "16",
    trend: 1,
    icon: Icons.Product,
  },
  {
    label: "Monthly Earnings",
    value: "RM 9,450",
    trend: 12,
    icon: Icons.Profit,
  },
];

export const PERSONAL_COACH_TODAY_SESSIONS: PersonalCoachSessionRow[] = [
  {
    id: "session-1",
    dayLabel: "Today",
    clientName: "James Lim",
    sessionType: "Weight Loss",
    startsAt: "2026-03-11T08:00:00+08:00",
    durationMinutes: 60,
    status: "Done",
    statusTone: "success",
  },
  {
    id: "session-2",
    dayLabel: "Today",
    clientName: "Priya G.",
    sessionType: "HIIT",
    startsAt: "2026-03-11T10:00:00+08:00",
    durationMinutes: 45,
    status: "Now",
    statusTone: "warning",
  },
  {
    id: "session-3",
    dayLabel: "Tomorrow",
    clientName: "Ravi K.",
    sessionType: "Strength",
    startsAt: "2026-03-12T09:00:00+08:00",
    durationMinutes: 90,
    status: "Scheduled",
    statusTone: "primary",
  },
  {
    id: "session-4",
    dayLabel: "Tomorrow",
    clientName: "Mel Xin",
    sessionType: "Yoga Flow",
    startsAt: "2026-03-12T14:00:00+08:00",
    durationMinutes: 60,
    status: "Scheduled",
    statusTone: "primary",
  },
];

export const PERSONAL_COACH_PROGRESS_SERIES: PersonalCoachProgressSeries[] = [
  {
    id: "series-james",
    clientName: "James Lim",
    color: "#7C3AED",
    points: [
      { label: "Week 1", value: 20 },
      { label: "Week 2", value: 28 },
      { label: "Week 3", value: 35 },
      { label: "Week 4", value: 42 },
      { label: "Week 5", value: 50 },
      { label: "Week 6", value: 57 },
      { label: "Week 7", value: 62 },
      { label: "Week 8", value: 65 },
    ],
  },
  {
    id: "series-priya",
    clientName: "Priya G.",
    color: "#E83E8C",
    points: [
      { label: "Week 1", value: 45 },
      { label: "Week 2", value: 52 },
      { label: "Week 3", value: 60 },
      { label: "Week 4", value: 65 },
      { label: "Week 5", value: 70 },
      { label: "Week 6", value: 74 },
      { label: "Week 7", value: 78 },
      { label: "Week 8", value: 80 },
    ],
  },
  {
    id: "series-ravi",
    clientName: "Ravi K.",
    color: "#0ABEF9",
    points: [
      { label: "Week 1", value: 10 },
      { label: "Week 2", value: 15 },
      { label: "Week 3", value: 18 },
      { label: "Week 4", value: 22 },
      { label: "Week 5", value: 28 },
      { label: "Week 6", value: 32 },
      { label: "Week 7", value: 35 },
      { label: "Week 8", value: 38 },
    ],
  },
];

export const PERSONAL_COACH_CLIENT_PROGRESS: PersonalCoachClientProgressRow[] = [
  {
    id: "progress-1",
    clientName: "James Lim",
    goal: "Weight Loss",
    progress: 65,
    nextReviewAt: "2026-03-15",
    adherence: "Strong",
  },
  {
    id: "progress-2",
    clientName: "Priya G.",
    goal: "Endurance",
    progress: 80,
    nextReviewAt: "2026-03-13",
    adherence: "Excellent",
  },
  {
    id: "progress-3",
    clientName: "Ravi K.",
    goal: "Muscle Gain",
    progress: 38,
    nextReviewAt: "2026-03-16",
    adherence: "Needs support",
  },
  {
    id: "progress-4",
    clientName: "Mel Xin",
    goal: "Mobility",
    progress: 54,
    nextReviewAt: "2026-03-18",
    adherence: "Stable",
  },
];

export const PERSONAL_COACH_MEDICAL_NOTES: PersonalCoachMedicalNoteRow[] = [
  {
    id: "note-1",
    clientName: "James Lim",
    note: "Knee injury",
    restriction: "No squats past 90 degrees; low-impact cardio only.",
    updatedAt: "2026-03-09",
    severity: "Monitor",
    severityTone: "warning",
  },
  {
    id: "note-2",
    clientName: "Ravi K.",
    note: "Lower back pain",
    restriction: "Avoid deadlifts; focus on core stability work.",
    updatedAt: "2026-03-08",
    severity: "High",
    severityTone: "danger",
  },
  {
    id: "note-3",
    clientName: "Aina Z.",
    note: "Shoulder tightness",
    restriction: "Limit overhead pressing volume this week.",
    updatedAt: "2026-03-07",
    severity: "Moderate",
    severityTone: "warning",
  },
];

export const PERSONAL_COACH_ANNOUNCEMENTS: PersonalCoachAnnouncementRow[] = [
  {
    id: "announcement-1",
    title: "Rate increase from 1 April",
    audience: "All active clients",
    publishAt: "2026-03-10",
    status: "Posted",
    statusTone: "success",
  },
  {
    id: "announcement-2",
    title: "Free nutrition workshop - 12 Mar",
    audience: "Transformation program clients",
    publishAt: "2026-03-09",
    status: "Posted",
    statusTone: "success",
  },
  {
    id: "announcement-3",
    title: "Form check video submission reminder",
    audience: "Remote coaching clients",
    publishAt: "2026-03-12",
    status: "Scheduled",
    statusTone: "primary",
  },
];
