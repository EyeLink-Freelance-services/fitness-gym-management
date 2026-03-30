import { AuthPermission } from "@/constants/permission";
import * as Icons from "../../components/IconsCollection/icons";
import type { NavSection } from "@/types/dashboard/dashboard-shared";
import { ROUTES } from "@/constants/route";

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Overview",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "General",
            url: ROUTES.DASHBOARD.COMPANY.ROOT,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Payment",
            url: ROUTES.DASHBOARD.COMPANY.PAYMENT,
            permission: AuthPermission.dashboard.company
          },
          {
            title: "Memberships Plan",
            url: ROUTES.DASHBOARD.COMPANY.MEMBERSHIP,
            permission: AuthPermission.dashboard.company
          },
        ],
        permission: AuthPermission.dashboard.company
      },
      {
        title: "Overview",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "My Clients",
            url: ROUTES.CLIENTS.LIST_CLIENT,
            permission: AuthPermission.dashboard.companyCoach
          },
          // {
          //   title: "My earnings",
          //   url: ROUTES.DASHBOARD.PERSONAL_COACH.ROOT,
          //   permission: AuthPermission.dashboard.companyCoach
          // },
          {
            title: "General",
            url: ROUTES.DASHBOARD.PERSONAL_COACH.ROOT,
            permission: AuthPermission.dashboard.personalCoach
          },
        ],
        permission: AuthPermission.dashboard.personalCoach || AuthPermission.dashboard.companyCoach
 
      },
      // {
      //   title: "Staff Dashboard",
      //   icon: Icons.HomeIcon,
      //   items: [
      //     {
      //       title: "Operations Overview",
      //       url: ROUTES.DASHBOARD.COMPANY,
      //       permission: AuthPermission.dashboard.companyStaff
      //     },
      //     // {
      //     //   title: "My earnings",
      //     //   url: ROUTES.DASHBOARD.PERSONAL_COACH.ROOT,
      //     //   permission: AuthPermission.dashboard.companyCoach
      //     // },
      //     {
      //       title: "Overview",
      //       url: ROUTES.DASHBOARD.PERSONAL_COACH.ROOT,
      //       permission: AuthPermission.dashboard.personalCoach
      //     },
      //   ],
      //   permission: AuthPermission.dashboard.personalCoach || AuthPermission.dashboard.companyCoach
 
      // },
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
        permission: AuthPermission.dashboard.company
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
