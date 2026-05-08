import type { NavItem, NavSection } from "@/types/dashboard/dashboard-shared";
import type { AppRole } from "@/config/routes.config";
import * as Icons from "@/components/IconsCollection/icons";
import { ROUTES } from "@/constants/route";
import { CLIENT_HAS_ASSIGNED_COACH } from "@/data/client";

type SidebarItemConfig = NavItem & {
  roles: readonly AppRole[];
  sectionLabel: string;
};

const SIDEBAR_ITEM_CONFIG: SidebarItemConfig[] = [
  {
    sectionLabel: "SUPER ADMIN",
    roles: ["super-admin"],
    title: "Overview",
    url: ROUTES.DASHBOARD.SUPER_ADMIN.ROOT,
    icon: Icons.HomeIcon,
    items: [],
  },
  {
    sectionLabel: "SUPER ADMIN",
    roles: ["super-admin"],
    title: "Companies",
    url: ROUTES.DASHBOARD.SUPER_ADMIN.COMPANY,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "SUPER ADMIN",
    roles: ["super-admin"],
    title: "Personal Coaches",
    url: ROUTES.DASHBOARD.SUPER_ADMIN.COACHES,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Overview",
    url: ROUTES.DASHBOARD.COMPANY.ROOT,
    icon: Icons.HomeIcon,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company", "company-coach"],
    title: "Clients",
    url: ROUTES.DASHBOARD.COMPANY.CLIENTS,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Coaches",
    url: ROUTES.DASHBOARD.COMPANY.COACHES,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Coach Assignments",
    url: ROUTES.DASHBOARD.COMPANY.CLIENT_COACH_ASSIGN,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Staff",
    url: ROUTES.DASHBOARD.COMPANY.STAFF,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Schema Builder",
    url: ROUTES.DASHBOARD.COMPANY.SCHEMA,
    icon: Icons.FourCircle,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Formula Builder",
    url: ROUTES.DASHBOARD.COMPANY.FORMULAS,
    icon: Icons.FourCircle,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Announcements",
    url: ROUTES.DASHBOARD.COMPANY.ANNOUNCEMENT,
    icon: Icons.Alphabet,
    items: [],
  },
  {
    sectionLabel: "COMPANY COACH",
    roles: ["company-coach"],
    title: "Overview",
    url: ROUTES.DASHBOARD.COMPANY.ROOT,
    icon: Icons.HomeIcon,
    items: [],
  },
  {
    sectionLabel: "COMPANY COACH",
    roles: ["company-coach"],
    title: "Data Entry",
    url: ROUTES.DASHBOARD.COMPANY.DATA_ENTRY,
    icon: Icons.FourCircle,
    items: [],
  },
  {
    sectionLabel: "COMPANY COACH",
    roles: ["company-coach"],
    title: "Specific Client Progress",
    url: ROUTES.DASHBOARD.COMPANY.PROGRESS,
    icon: Icons.TrainingIcon,
    items: [],
  },
  {
    sectionLabel: "COMPANY COACH",
    roles: ["company-coach"],
    title: "Sessions",
    url: ROUTES.DASHBOARD.COMPANY.SESSIONS,
    icon: Icons.Calendar,
    items: [],
  },
  {
    sectionLabel: "COMPANY COACH",
    roles: ["company-coach"],
    title: "Training Plan",
    url: ROUTES.TRAINING_PLANS.TEMPLATES,
    icon: Icons.TrainingIcon,
    items: [],
  },
  {
    sectionLabel: "COMPANY COACH",
    roles: ["company-coach"],
    title: "Diet Plan",
    url: ROUTES.DIET_PLANS.TEMPLATES,
    icon: Icons.DietPlanIcon,
    items: [],
  },
  {
    sectionLabel: "PERSONAL COACH",
    roles: ["personal-coach"],
    title: "Overview",
    url: ROUTES.DASHBOARD.PERSONAL_COACH.ROOT,
    icon: Icons.HomeIcon,
    items: [],
  },
  {
    sectionLabel: "PERSONAL COACH",
    roles: ["personal-coach"],
    title: "Clients",
    url: ROUTES.DASHBOARD.PERSONAL_COACH.CLIENTS,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "PERSONAL COACH",
    roles: ["personal-coach"],
    title: "Sessions",
    url: ROUTES.DASHBOARD.PERSONAL_COACH.SESSIONS,
    icon: Icons.Calendar,
    items: [],
  },
  {
    sectionLabel: "PERSONAL COACH",
    roles: ["personal-coach"],
    title: "Data Entry",
    url: ROUTES.DASHBOARD.PERSONAL_COACH.DATA_ENTRY,
    icon: Icons.FourCircle,
    items: [],
  },
  {
    sectionLabel: "PERSONAL COACH",
    roles: ["personal-coach"],
    title: "Schema Builder",
    url: ROUTES.DASHBOARD.PERSONAL_COACH.SCHEMA,
    icon: Icons.FourCircle,
    items: [],
  },
  {
    sectionLabel: "PERSONAL COACH",
    roles: ["personal-coach"],
    title: "Formula Builder",
    url: ROUTES.DASHBOARD.PERSONAL_COACH.FORMULAS,
    icon: Icons.FourCircle,
    items: [],
  },
  {
    sectionLabel: "PERSONAL COACH",
    roles: ["personal-coach"],
    title: "Announcements",
    url: ROUTES.DASHBOARD.PERSONAL_COACH.ANNOUNCEMENTS,
    icon: Icons.Alphabet,
    items: [],
  },
  {
    sectionLabel: "CLIENT",
    roles: ["client"],
    title: "Overview",
    url: ROUTES.DASHBOARD.CLIENT.ROOT,
    icon: Icons.HomeIcon,
    items: [],
  },
  {
    sectionLabel: "CLIENT",
    roles: ["client"],
    title: "Sessions",
    url: ROUTES.DASHBOARD.CLIENT.SESSIONS,
    icon: Icons.Calendar,
    items: [],
    disabled: !CLIENT_HAS_ASSIGNED_COACH,
  },
];

export function getSidebarNavForRole(role: AppRole | null): NavSection[] {
  if (!role) return [];

  const grouped = new Map<string, NavItem[]>();
  const visibleItems = SIDEBAR_ITEM_CONFIG.filter((item) => item.roles.includes(role));

  for (const item of visibleItems) {
    const sectionItems = grouped.get(item.sectionLabel) ?? [];
    sectionItems.push({
      title: item.title,
      url: item.url,
      icon: item.icon,
      items: item.items,
      permission: item.permission,
      disabled: item.disabled,
    });
    grouped.set(item.sectionLabel, sectionItems);
  }

  return Array.from(grouped.entries()).map(([label, items]) => ({ label, items }));
}
