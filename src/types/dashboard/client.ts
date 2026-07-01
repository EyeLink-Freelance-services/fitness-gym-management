import type { StatusTone } from "@/types/shared";
import type { JSX, SVGProps } from "react";

export interface ClientOverviewItem {
  label: string;
  value: string;
  trend?: number;
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export interface ClientMembershipSummary {
  planName: string;
  monthlyPrice: string;
  renewalMode?: string;
  memberSince: string;
  branch: string;
  daysRemaining: number;
  benefits: string[];
}

export interface ClientCoachSummary {
  name: string;
  initials: string;
  title: string;
  location: string;
  rating?: string;
  picture?: string;
  experience: string;
  languages: string[];
  certifications: string[];
  availability: string;
}

export interface ClientWeightTrendPoint {
  label: string;
  weight: number;
  target: number;
}

export interface ClientBodyCompositionPoint {
  label: string;
  bodyFat: number;
  muscleMass: number;
}

export interface ClientUpcomingSessionRow {
  id: string;
  session: string;
  coachName: string;
  startsAt: string;
  durationMinutes: number;
  location: string;
  status: string;
  statusTone: StatusTone;
}

export interface ClientBodyMeasurementRow {
  id: string;
  metric: string;
  value: string;
  change: string;
  changeTone: StatusTone;
  lastUpdated: string;
}

export interface ClientWorkoutPlanRow {
  id: string;
  day: string;
  focus: string;
  exercises: string;
  duration: string;
  volume: string;
  status: string;
  statusTone: StatusTone;
}

export interface ClientMealPlanRow {
  id: string;
  meal: string;
  time: string;
  items: string;
  macros: string;
  calories: string;
}

export type CoachMealTimeOption =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Specific";

export type CoachTrainingPlanDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface CoachDietPlanMeal {
  id: string;
  timeSlot: CoachMealTimeOption;
  specificTime?: string;
  meal: string;
}

export interface CoachDietPlanRecord {
  id: string;
  clientId: string;
  clientName: string;
  meals: CoachDietPlanMeal[];
  updatedAt: string;
}

export interface CoachTrainingPlanEntry {
  day: CoachTrainingPlanDay;
  exercise: string;
}

export interface CoachTrainingPlanRecord {
  id: string;
  clientId: string;
  clientName: string;
  days: CoachTrainingPlanEntry[];
  updatedAt: string;
}

export interface CoachDietPlanRow {
  id: string;
  clientName: string;
  mealsSummary: string;
  totalMeals: number;
  updatedAt: string;
}

export interface ClientDietPlanRow {
  id: string;
  mealInterval: string;
  mealTime?: string;
  mealDescription: string;
  updatedAt: string;
}

export interface ClientTrainingPlanRow {
  id: string;
  planId: string;
  day: CoachTrainingPlanDay;
  trainingActivity: string;
  updatedAt: string;
}

export interface ClientTrainingSessionRow {
  id: string;
  coachName: string;
  sessionTitle: string;
  date: string;
  timeFrom: string;
  timeTo: string;
}

export interface CoachTrainingPlanRow {
  id: string;
  clientName: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  repeats: string;
  updatedAt: string;
}

export interface ClientPaymentRow {
  id: string;
  invoice: string;
  plan: string;
  amount: string;
  paidAt: string;
  status: string;
  statusTone: StatusTone;
}
