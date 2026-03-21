import type { StatusTone } from "@/types/shared";
import type { JSX, SVGProps } from "react";

export interface PersonalCoachOverviewItem {
  label: string;
  value: string;
  trend: number;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export interface PersonalCoachSessionRow {
  id: string;
  dayLabel: "Today" | "Tomorrow";
  clientName: string;
  sessionType: string;
  startsAt: string;
  durationMinutes: number;
  status: string;
  statusTone: StatusTone;
}

export type PersonalCoachSessionProps = {
  sessions: PersonalCoachSessionRow[];
};

export type PersonalCoachProgressProps = {
  data: import("@/types/dashboard/client-records").ClientProgressSeries[];
};

export type MedicalNoteSeverity = "high" | "moderate" | "low";

export interface PersonalCoachMedicalNoteRow {
  id: string;
  clientName: string;
  note: string;
  restriction: string;
  updatedAt: string;
  severity: string;
  severityTone: StatusTone;
}

export interface PersonalCoachAnnouncementRow {
  id: string;
  title: string;
  audience?: string;
  publishAt: string;
  status: string;
  statusTone: StatusTone;
}
