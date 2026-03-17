import { AuthPermission } from "@/constants/permission";
import * as Icons from "../../components/IconsCollection/icons";
import type { NavSection } from "@/types/dashboard/dashboard-shared";
import { ROUTES } from "@/constants/route";
import { IAuthContext } from "@/types/auth-context";

// <export function getAuthorizedNav(
//   itemSections: NavSection[],
//   auth: IAuthContext | undefined
// ): NavSection[] {
//   return itemSections
//     .map((section) => ({
//       ...section,
//       items: section.items.filter((item) => {
//         // parent without permission -> keep it
//         if (!item.permission) {
//           // if it has children, optionally filter children too
//           if (item.items?.length) {
//             return true;
//           }
//           return true;
//         }

//         return auth?.permissions?.includes(item.permission);
//       }),
//     }))
//     .filter((section) => section.items.length > 0);
// }>

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
            title: "Announcements & Communications",
            url: ROUTES.DASHBOARD.COMPANY.ANNOUNCEMENT,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Clients & Coach Assigned",
            url: ROUTES.DASHBOARD.COMPANY.CLIENT_COACH_ASSIGN,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Clients",
            url: ROUTES.DASHBOARD.COMPANY.CLIENTS,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Coaches Overview",
            url: ROUTES.DASHBOARD.COMPANY.COACHES,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Memberships",
            url: ROUTES.DASHBOARD.COMPANY.MEMBERSHIP,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Payment Overview",
            url: ROUTES.DASHBOARD.COMPANY.PAYMENT,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Staff Overview",
            url: ROUTES.DASHBOARD.COMPANY.STAFF,
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
            title: "My Clients",
            url: ROUTES.DASHBOARD.COMPANY.CLIENTS,
            permission: AuthPermission.dashboard.companyCoach
          },
          {
            title: "Data Entry",
            url: ROUTES.DASHBOARD.COMPANY.DATA_ENTRY,
            permission: AuthPermission.dashboard.companyCoach
          },
          {
            title: "Progress",
            url: ROUTES.DASHBOARD.COMPANY.PROGRESS,
            permission: AuthPermission.dashboard.companyCoach
          }
        ],
        permission: AuthPermission.dashboard.companyCoach
      },
      {
        title: "Main Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "General Overview",
            url: ROUTES.DASHBOARD.PERSONAL_COACH.ROOT,
            permission: AuthPermission.dashboard.personalCoach
          },
          {
            title: "Clients",
            url: ROUTES.DASHBOARD.PERSONAL_COACH.CLIENTS,
            permission: AuthPermission.dashboard.personalCoach
          },
          {
            title: "Schema Builder",
            url: ROUTES.DASHBOARD.PERSONAL_COACH.SCHEMA,
            permission: AuthPermission.dashboard.personalCoach
          },
          {
            title: "Formula Builder",
            url: ROUTES.DASHBOARD.PERSONAL_COACH.FORMULAS,
            permission: AuthPermission.dashboard.personalCoach
          },
          {
            title: "Data Entry",
            url: ROUTES.DASHBOARD.PERSONAL_COACH.DATA_ENTRY,
            permission: AuthPermission.dashboard.personalCoach
          },
          {
            title: "Progress",
            url: ROUTES.DASHBOARD.PERSONAL_COACH.PROGRESS,
            permission: AuthPermission.dashboard.personalCoach
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
            permission: AuthPermission.dashboard.superAdmin
          },
          {
            title: "Coaches",
            url: ROUTES.DASHBOARD.SUPER_ADMIN.COACHES,
            permission: AuthPermission.dashboard.superAdmin
          },
          {
            title: "Companies",
            url: ROUTES.DASHBOARD.SUPER_ADMIN.COMPANY,
            permission: AuthPermission.dashboard.superAdmin
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
