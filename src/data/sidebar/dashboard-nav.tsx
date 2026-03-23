import { NavSection } from "@/types/dashboard/dashboard-shared";
import * as Icons from "../../components/IconsCollection/icons";
import { section } from "@/utils/dashboard-nav";
import { ROUTES } from "@/constants/route";

/** 1. Super Admin */
export const SUPER_ADMIN_NAV: NavSection[] = [
  section("SUPER ADMIN", [
    {
      title: "Overview",
      url: ROUTES.DASHBOARD.SUPER_ADMIN.ROOT,
      icon: Icons.HomeIcon,
      items: [],
    },
    {
      title: "Companies",
      url: ROUTES.DASHBOARD.SUPER_ADMIN.COMPANY,
      icon: Icons.User,
      items: [],
    },
    {
      title: "Personal Coaches",
      url: ROUTES.DASHBOARD.SUPER_ADMIN.COACHES,
      icon: Icons.User,
      items: [],
    },
  ]),
];

/** 2. Company (Gym) */
export const COMPANY_NAV: NavSection[] = [
  section("COMPANY", [
    {
      title: "Overview",
      url: ROUTES.DASHBOARD.COMPANY.ROOT,
      icon: Icons.HomeIcon,
      items: [],
    },
    {
      title: "Clients",
      url: ROUTES.DASHBOARD.COMPANY.CLIENTS,
      icon: Icons.User,
      items: [],
    },
    {
      title: "Coaches",
      url: ROUTES.DASHBOARD.COMPANY.COACHES,
      icon: Icons.User,
      items: [],
    },

    {
      title: "Coach Assignments",
      url: ROUTES.DASHBOARD.COMPANY.CLIENT_COACH_ASSIGN,
      icon: Icons.User,
      items: [],
    },
    {
      title: "Schema Builder",
      url: ROUTES.DASHBOARD.COMPANY.SCHEMA,
      icon: Icons.FourCircle,
      items: [],
    },
    {
      title: "Formula Builder",
      url: ROUTES.DASHBOARD.COMPANY.FORMULAS,
      icon: Icons.FourCircle,
      items: [],
    },
    {
      title: "Announcements",
      url: ROUTES.DASHBOARD.COMPANY.ANNOUNCEMENT,
      icon: Icons.Alphabet,
      items: [],
    },
  ]),
];

/** 3. Company Coach */
export const COMPANY_COACH_NAV: NavSection[] = [
  section("COMPANY COACH", [
    {
      title: "Overview",
      url: ROUTES.DASHBOARD.COMPANY.ROOT,
      icon: Icons.HomeIcon,
      items: [],
    },
    {
      title: "Clients",
      url: ROUTES.DASHBOARD.COMPANY.CLIENTS,
      icon: Icons.User,
      items: [],
    },
    {
      title: "Data Entry",
      url: ROUTES.DASHBOARD.COMPANY.DATA_ENTRY,
      icon: Icons.FourCircle,
      items: [],
    },
    {
      title: "Specific Client Progress",
      url: ROUTES.DASHBOARD.COMPANY.PROGRESS,
      icon: Icons.TrainingIcon,
      items: [],
    },
    {
      title: "Training Plan",
      url: ROUTES.TRAINING_PLANS.TEMPLATES,
      icon: Icons.TrainingIcon,
      items: [],
    },
    {
      title: "Diet Plan",
      url: ROUTES.DIET_PLANS.TEMPLATES,
      icon: Icons.DietPlanIcon,
      items: [],
    },
  ]),
];

/** 4. Personal Coach */
export const PERSONAL_COACH_NAV: NavSection[] = [
  section("PERSONAL COACH", [
    {
      title: "Overview",
      url: ROUTES.DASHBOARD.PERSONAL_COACH.ROOT,
      icon: Icons.HomeIcon,
      items: [],
    },
    {
      title: "Clients",
      url: ROUTES.DASHBOARD.PERSONAL_COACH.CLIENTS,
      icon: Icons.User,
      items: [],
    },
    {
      title: "Training Plan",
      url: ROUTES.DASHBOARD.PERSONAL_COACH.TRAINING_PLAN,
      icon: Icons.TrainingIcon,
      items: [],
    },
    {
      title: "Diet Plan",
      url: ROUTES.DASHBOARD.PERSONAL_COACH.DIET_PLAN,
      icon: Icons.DietPlanIcon,
      items: [],
    },
    {
      title: "Data Entry",
      url: ROUTES.DASHBOARD.PERSONAL_COACH.DATA_ENTRY,
      icon: Icons.FourCircle,
      items: [],
    },
    {
      title: "Schema Builder",
      url: ROUTES.DASHBOARD.PERSONAL_COACH.SCHEMA,
      icon: Icons.FourCircle,
      items: [],
    },
    {
      title: "Formula Builder",
      url: ROUTES.DASHBOARD.PERSONAL_COACH.FORMULAS,
      icon: Icons.FourCircle,
      items: [],
    },
    {
      title: "Announcements",
      url: ROUTES.DASHBOARD.PERSONAL_COACH.ANNOUNCEMENTS,
      icon: Icons.Alphabet,
      items: [],
    },
  ]),
];

/** 5. Client */
export const CLIENT_NAV: NavSection[] = [
  section("CLIENT", [
    {
      title: "Overview",
      url: ROUTES.DASHBOARD.CLIENT.ROOT,
      icon: Icons.HomeIcon,
      items: [],
    },
    {
      title: "Weekly Calendar",
      url: ROUTES.DASHBOARD.CLIENT.WEEKLY_CALENDAR,
      icon: Icons.Calendar,
      items: [],
    },
  ]),
];
