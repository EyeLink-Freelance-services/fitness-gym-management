import { AuthPermission } from "@/constants/permission";
import * as Icons from "../../components/IconsCollection/icons";
import type { NavSection } from "@/types/dashboard";
import { ROUTES } from "@/constants/route";

export function getAuthorizedNav(
  itemSections: NavSection[],
  permissions?: string[]
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

        return permissions?.includes(item.permission);
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
          },
          {
            title: "Announcements & Communications",
            url: ROUTES.DASHBOARD.COMPANY.ANNOUNCEMENT,
          },
          {
            title: "Clients & Coach Assigned",
            url: ROUTES.DASHBOARD.COMPANY.CLIENT_COACH_ASSIGN,
          },
          {
            title: "Clients",
            url: ROUTES.DASHBOARD.COMPANY.CLIENTS,
          },
          {
            title: "Coaches Overview",
            url: ROUTES.DASHBOARD.COMPANY.COACHES,
          },
          {
            title: "Memberships",
            url: ROUTES.DASHBOARD.COMPANY.MEMBERSHIP,
          },
          {
            title: "Payment Overview",
            url: ROUTES.DASHBOARD.COMPANY.PAYMENT,
          },
          {
            title: "Staff Overview",
            url: ROUTES.DASHBOARD.COMPANY.STAFF,
          },
        ],
        permission: AuthPermission.dashboard.company
      },
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "General Overview",
            url: ROUTES.DASHBOARD.PERSONAL_COACH.ROOT,
          }
        ],
        permission: AuthPermission.dashboard.personalCoach
      },
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "General Overview",
            url: ROUTES.DASHBOARD.SUPER_ADMIN.ROOT,
          },
          {
            title: "Coaches",
            url: ROUTES.DASHBOARD.SUPER_ADMIN.COACHES,
          },
          {
            title: "Companies",
            url: ROUTES.DASHBOARD.SUPER_ADMIN.COMPANY,
          }
        ],
        permission: AuthPermission.dashboard.superAdmin
      },
      {
        title: "Members",
        url: ROUTES.MEMBERS.LIST_MEMBER,
        icon: Icons.User,
        items: [],
        permission: AuthPermission.members.view
      },
      {
        title: "Membership Plans",
        url: ROUTES.MEMBERSHIP.LIST_MEMBERSHIP,
        icon: Icons.User,
        items: [],
        permission: AuthPermission.membershipPlans.view
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
        title: "Calendar & Schedule",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
        permission: AuthPermission.calendar.view,
      },
      {
        title: "Payment records",
        url: "/payments",
        icon: Icons.PaymentsIcon,
        items: [],
        permission: AuthPermission.payments.view
      },
      {
        title: "Additional Services",
        url:'/additional-services',
        icon: Icons.AdditionalServicesIcon,
        items: [],
        permission: AuthPermission.services.view
      },
      {
        title: "Communication & Announcement",
        url: "/announcement",
        icon: Icons.Alphabet,
        items: [],
        permission: AuthPermission.announcements.view
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
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
