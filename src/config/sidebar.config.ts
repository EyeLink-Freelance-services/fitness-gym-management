import type { NavItem, NavSection } from "@/types/dashboard/dashboard-shared";
import type { AppRole } from "@/config/routes.config";
import * as Icons from "@/components/IconsCollection/icons";
import { ROUTES } from "@/constants/route";

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
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Overview",
    url: ROUTES.DASHBOARD.COMPANY.ROOT,
    icon: Icons.HomeIcon,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Clients",
    url: ROUTES.DASHBOARD.COMPANY.CLIENTS,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "COMPANY",
    roles: ["company"],
    title: "Payment",
    url: ROUTES.DASHBOARD.COMPANY.PAYMENT,
    icon: Icons.PaymentsIcon,
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
  // {
  //   sectionLabel: "COMPANY",
  //   roles: ["company"],
  //   title: "Coach Assignments",
  //   url: ROUTES.DASHBOARD.COMPANY.CLIENT_COACH_ASSIGN,
  //   icon: Icons.User,
  //   items: [],
  // },
  // {
  //   sectionLabel: "COMPANY",
  //   roles: ["company"],
  //   title: "Staff",
  //   url: ROUTES.DASHBOARD.COMPANY.STAFF,
  //   icon: Icons.User,
  //   items: [],
  // },
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
    title: "Clients",
    url: ROUTES.DASHBOARD.COMPANY.CLIENTS,
    icon: Icons.User,
    items: [],
  },
  {
    sectionLabel: "CLIENT",
    roles: ["client"],
    title: "Overview",
    url: ROUTES.DASHBOARD.COMPANY.ROOT,
    icon: Icons.HomeIcon,
    items: [],
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
