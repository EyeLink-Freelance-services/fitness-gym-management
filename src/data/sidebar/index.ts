import { AuthPermission } from "@/constants/permission";
import * as Icons from "../../components/IconsCollection/icons";
import type { NavSection } from "@/types/dashboard/dashboard-shared";
import { ROUTES } from "@/constants/route";
import { IAuthContext } from "@/types/auth-context";

export function getAuthorizedNav(
  itemSections: NavSection[],
  auth: IAuthContext | null | undefined
): NavSection[] {
  return itemSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // parent without permission -> keep it
        if (!item.permission) {
          // if it has children, optionally filter children too
          if (item.items?.length) {
            return true;
          }
          return true;
        }

        return auth?.permissions?.includes(item.permission);
      }),
    }))
    .filter((section) => section.items.length > 0);
}

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "General Overview",
            url: ROUTES.DASHBOARD.COMPANY.ROOT,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Payment Overview",
            url: ROUTES.DASHBOARD.COMPANY.PAYMENT,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Memberships Plan Overview",
            url: ROUTES.DASHBOARD.COMPANY.MEMBERSHIP,
            permission: AuthPermission.dashboard.company
          },
        ],
        permission: AuthPermission.dashboard.company
      },
      {
        title: "Coach Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "My Clients Overview",
            url: ROUTES.CLIENTS.LIST_CLIENT,
            permission: AuthPermission.dashboard.companyCoach
          },
          // {
          //   title: "My earnings",
          //   url: ROUTES.DASHBOARD.COMPANY.PROGRESS,
          //   permission: AuthPermission.dashboard.companyCoach
          // },
        ],
        permission: AuthPermission.dashboard.companyCoach
      },
      // {
      //   title: "Progress",
      //   url: ROUTES.DASHBOARD.COMPANY.PROGRESS,
      //   icon: Icons.HomeIcon,
      //   items: [],
      //   permission: AuthPermission.progress.view
      // },
      {
        title: "Clients",
        url: ROUTES.CLIENTS.LIST_CLIENT,
        icon: Icons.User,
        items: [],
        permission: AuthPermission.clients.view
      },
      {
        title: "Training Plans",
        url: ROUTES.TRAINING_PLANS.TEMPLATES,
        icon: Icons.TrainingIcon,
        items: [],
        permission: AuthPermission.trainingPlans.view
      },
      {
        title: "Diet Plans",
        url: ROUTES.DIET_PLANS.TEMPLATES,
        icon: Icons.DietPlanIcon,
        items: [],
        permission: AuthPermission.dietPlans.view
      },
      {
        title: "Schema Builder",
        url: ROUTES.SCHEMA,
        icon: Icons.FourCircle,
        items: [],
        permission: AuthPermission.dietPlans.view
      },
      {
        title: "Formula Builder",
        url: ROUTES.FORMULAS,
        icon: Icons.FourCircle,
        items: [],
        permission: AuthPermission.dietPlans.view
      },
      {
        title: "Calendar & Schedule",
        url: ROUTES.CALENDAR,
        icon: Icons.Calendar,
        items: [],
        permission: AuthPermission.calendar.view,
      },
      // {
      //   title: "Additional Services",
      //   url:'/additional-services',
      //   icon: Icons.AdditionalServicesIcon,
      //   items: [],
      //   permission: AuthPermission.services.view
      // },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        title: "Announcements & Communications",
        url: ROUTES.ANNOUNCEMENT,
        icon: Icons.Alphabet,
        items: [],
        permission: AuthPermission.announcements.view
      },
      {
        title: "Team",
        icon: Icons.User,
        items: [
          {
            title: "Coaches",
            url: ROUTES.COACHES.LIST_COACH,
            permission: AuthPermission.coach.view
          },
          {
            title: "Staffs",
            url: ROUTES.STAFF.LIST_STAFF,
            permission: AuthPermission.staff.view
          },
        ],
      },
      {
        title: "Membership Plans",
        url: ROUTES.MEMBERSHIP.LIST_MEMBERSHIP,
        icon: Icons.User,
        items: [],
        permission: AuthPermission.membershipPlans.view
      },
      {
        title: "Payment records",
        url: "/payments",
        icon: Icons.PaymentsIcon,
        items: [],
        permission: AuthPermission.payments.view
      },
      {
        title: "Tasks",
        url:'/tasks',
        icon: Icons.Alphabet,
        items: [],
        permission: AuthPermission.tasks.view
      },
      {
        title: "Settings",
        url:'/settings',
        icon: Icons.FourCircle,
        items: [],
        permission: AuthPermission.settings.view
      },
    ],
  }
];
