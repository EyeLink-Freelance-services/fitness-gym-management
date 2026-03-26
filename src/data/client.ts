import * as Icons from "@/components/IconsCollection/icons";
import type {
  ClientBodyCompositionPoint,
  ClientBodyMeasurementRow,
  ClientCoachSummary,
  ClientMealPlanRow,
  ClientMembershipSummary,
  ClientOverviewItem,
  ClientPaymentRow,
  ClientUpcomingSessionRow,
  ClientWeightTrendPoint,
  ClientWorkoutPlanRow,
} from "@/types/dashboard/client";

export const CLIENT_OVERVIEW: ClientOverviewItem[] = [
  {
    label: "Current Weight (kg)",
    value: "74.2",
    trend: -4.3,
    icon: Icons.Gym,
  },
  {
    label: "Body Fat (%)",
    value: "18.4",
    trend: -2.1,
    icon: Icons.Product,
  },
  {
    label: "Lean Muscle (kg)",
    value: "57.6",
    trend: 1.4,
    icon: Icons.Users,
  },
  {
    label: "Goal Completion(%)",
    value: "72",
    trend: 8,
    icon: Icons.Profit,
  },
  {
    label: "Member Since",
    value: "January 2025",
  },
  {
    label: "Renewal (days)",
    value: "29",
  },
  {
    label: "Monthly Price",
    value: "250.00",
  },
  {
    label: "Branch",
    value: "KL Sentral (all access)",
  },
];

export const CLIENT_MEMBERSHIP_SUMMARY: ClientMembershipSummary = {
  planName: "Premium",
  monthlyPrice: "250.00",
  memberSince: "January 2025",
  branch: "KL Sentral (all access)",
  daysRemaining: 29,
  benefits: [
    "Full gym access - all branches",
    "Unlimited group classes",
    "8 personal training sessions / month",
    "Nutrition consultation",
    "Locker & shower access",
  ],
};

export const CLIENT_COACH_SUMMARY: ClientCoachSummary = {
  name: "Siti Nurhaliza",
  picture: "https://cdn.pixabay.com/photo/2012/04/14/14/32/skull-34133_1280.png",
  initials: "SK",
  title: "Strength & Conditioning Coach",
  location: "Klang Valley, KL Sentral",
  experience: "8 years experience",
  languages: ["English", "Bahasa Melayu"],
  certifications: ["ACE-CPT", "NASM Certified"],
  availability: "Available Today",
};

export const CLIENT_WEIGHT_TREND: ClientWeightTrendPoint[] = [
  { label: "W1", weight: 78.0, target: 78.0 },
  { label: "W2", weight: 77.1, target: 77.4 },
  { label: "W3", weight: 76.8, target: 76.8 },
  { label: "W4", weight: 76.0, target: 76.2 },
  { label: "W5", weight: 75.3, target: 75.6 },
  { label: "W6", weight: 74.9, target: 75.0 },
  { label: "W7", weight: 74.5, target: 74.4 },
  { label: "W8", weight: 74.2, target: 73.8 },
];

export const CLIENT_BODY_COMPOSITION: ClientBodyCompositionPoint[] = [
  { label: "W1", bodyFat: 20.1, muscleMass: 56.2 },
  { label: "W2", bodyFat: 19.8, muscleMass: 56.3 },
  { label: "W3", bodyFat: 19.5, muscleMass: 56.5 },
  { label: "W4", bodyFat: 19.2, muscleMass: 56.7 },
  { label: "W5", bodyFat: 19.0, muscleMass: 56.9 },
  { label: "W6", bodyFat: 18.8, muscleMass: 57.1 },
  { label: "W7", bodyFat: 18.6, muscleMass: 57.4 },
  { label: "W8", bodyFat: 18.4, muscleMass: 57.6 },
];

export const CLIENT_UPCOMING_SESSIONS: ClientUpcomingSessionRow[] = [
  {
    id: "session-1",
    session: "Strength Training",
    coachName: "Siti K.",
    startsAt: "2026-03-13T18:00:00+08:00",
    durationMinutes: 60,
    location: "KL Sentral",
    status: "Today",
    statusTone: "warning",
  },
  {
    id: "session-2",
    session: "Upper Body Push",
    coachName: "Siti K.",
    startsAt: "2026-03-17T10:00:00+08:00",
    durationMinutes: 60,
    location: "KL Sentral",
    status: "Upcoming",
    statusTone: "primary",
  },
  {
    id: "session-3",
    session: "HIIT Conditioning",
    coachName: "Siti K.",
    startsAt: "2026-03-19T09:00:00+08:00",
    durationMinutes: 45,
    location: "Studio B",
    status: "Upcoming",
    statusTone: "primary",
  },
];

export const CLIENT_BODY_MEASUREMENTS: ClientBodyMeasurementRow[] = [
  {
    id: "measurement-1",
    metric: "Height",
    value: "172 cm",
    change: "Stable",
    changeTone: "neutral",
    lastUpdated: "2026-02-18",
  },
  {
    id: "measurement-2",
    metric: "Target Weight",
    value: "70 kg",
    change: "Goal",
    changeTone: "primary",
    lastUpdated: "2026-02-18",
  },
  {
    id: "measurement-3",
    metric: "Chest",
    value: "96 cm",
    change: "+3 cm",
    changeTone: "success",
    lastUpdated: "2026-02-18",
  },
  {
    id: "measurement-4",
    metric: "Waist",
    value: "84 cm",
    change: "-4 cm",
    changeTone: "success",
    lastUpdated: "2026-02-18",
  },
  {
    id: "measurement-5",
    metric: "Hips",
    value: "98 cm",
    change: "+2 cm",
    changeTone: "success",
    lastUpdated: "2026-02-18",
  },
  {
    id: "measurement-6",
    metric: "Resting HR",
    value: "62 bpm",
    change: "-8 bpm",
    changeTone: "success",
    lastUpdated: "2026-02-18",
  },
];

export const CLIENT_WORKOUT_PLAN: ClientWorkoutPlanRow[] = [
  {
    id: "plan-1",
    day: "Monday",
    focus: "Upper Body Push",
    exercises: "Bench press, overhead press, incline DB fly, lateral raises",
    duration: "60 min",
    volume: "4 sets x 8 reps",
    status: "Today",
    statusTone: "success",
  },
  {
    id: "plan-2",
    day: "Tuesday",
    focus: "Rest / Active Recovery",
    exercises: "Light walk, mobility, stretching",
    duration: "20-30 min",
    volume: "Recovery",
    status: "Rest",
    statusTone: "neutral",
  },
  {
    id: "plan-3",
    day: "Wednesday",
    focus: "Lower Body",
    exercises: "Squat, RDL, lunges, calf raises",
    duration: "45 min",
    volume: "3 supersets",
    status: "Upcoming",
    statusTone: "primary",
  },
  {
    id: "plan-4",
    day: "Thursday",
    focus: "Upper Body Pull",
    exercises: "Rows, pull-downs, curls, rear delts",
    duration: "60 min",
    volume: "4 sets x 10 reps",
    status: "Upcoming",
    statusTone: "primary",
  },
  {
    id: "plan-5",
    day: "Saturday",
    focus: "HIIT Conditioning",
    exercises: "Circuit work, intervals, sled pushes",
    duration: "45 min",
    volume: "8 rounds",
    status: "Set",
    statusTone: "warning",
  },
];

export const CLIENT_MEAL_PLAN: ClientMealPlanRow[] = [
  {
    id: "meal-1",
    meal: "Breakfast",
    time: "7:00 - 8:00 AM",
    items: "3 whole eggs, oats with berries, black coffee",
    macros: "P42 / C52 / F14",
    calories: "490 kcal",
  },
  {
    id: "meal-2",
    meal: "Mid-Morning Snack",
    time: "10:00 AM",
    items: "Whey shake, 1 banana, mixed nuts",
    macros: "P28 / C30 / F10",
    calories: "320 kcal",
  },
  {
    id: "meal-3",
    meal: "Lunch",
    time: "12:30 - 1:30 PM",
    items: "Grilled chicken breast, brown rice, mixed greens",
    macros: "P48 / C56 / F12",
    calories: "540 kcal",
  },
  {
    id: "meal-4",
    meal: "Pre-Workout",
    time: "45 min before training",
    items: "Rice cakes with peanut butter, banana",
    macros: "P10 / C42 / F8",
    calories: "280 kcal",
  },
  {
    id: "meal-5",
    meal: "Dinner",
    time: "7:00 - 8:00 PM",
    items: "Salmon fillet, quinoa, mixed vegetables",
    macros: "P47 / C31 / F14",
    calories: "470 kcal",
  },
];

export const CLIENT_PAYMENT_HISTORY: ClientPaymentRow[] = [
  {
    id: "payment-1",
    invoice: "INV-2026-0143",
    plan: "Premium",
    amount: "250.00",
    paidAt: "2026-03-01",
    status: "Paid",
    statusTone: "success",
  },
  {
    id: "payment-2",
    invoice: "INV-2026-0298",
    plan: "Premium",
    amount: "187.50",
    paidAt: "2026-02-01",
    status: "Promo Applied",
    statusTone: "primary",
  },
  {
    id: "payment-3",
    invoice: "INV-2026-0251",
    plan: "Premium",
    amount: "250.00",
    paidAt: "2026-01-01",
    status: "Paid",
    statusTone: "success",
  },
  {
    id: "payment-4",
    invoice: "INV-2025-0294",
    plan: "Standard",
    amount: "150.00",
    paidAt: "2025-12-01",
    status: "Paid",
    statusTone: "success",
  },
];
