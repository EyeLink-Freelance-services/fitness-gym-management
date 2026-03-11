import * as Icons from "../../components/IconsCollection/icons";
import type { NavSection } from "@/types/dashboard";

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
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
        permission: "dashboard.view"
      },
      {
        title: "Members",
        url:'/members',
        icon: Icons.User,
        items: [],
        permission: "members.view"
      },
      {
        title: "Membership Plans",
        url:'/membership-plans',
        icon: Icons.User,
        items: [],
        permission: "membership_plans.view"
      },
      {
        title: "Training Plans",
        url: "/training-plans",
        icon: Icons.TrainingIcon,
        items: [],
        permission: "training_plans.view"
      },
      {
        title: "Diet Plans",
        url: "/diet-plans",
        icon: Icons.DietPlanIcon,
        items: [],
        permission: "diet_plans.view"
      },
      {
        title: "Calendar & Schedule",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
        permission: "calendar.view"
      },
      {
        title: "Payment records",
        url: "/payments",
        icon: Icons.PaymentsIcon,
        items: [],
        permission: "payments.view"
      },
      {
        title: "Additional Services",
        url:'/additional-services',
        icon: Icons.AdditionalServicesIcon,
        items: [],
        permission: "services.view"
      },
      {
        title: "Communication & Announcement",
        url: "/announcement",
        icon: Icons.Alphabet,
        items: [],
        permission: "announcements.view"
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        title: "User",
        icon: Icons.User,
        items: [
          {
            title: "All Users",
            url: "/users",
          },
          {
            title: "Staff",
            url: "/staff",
          },
          {
            title: "Coaches",
            url: "/coaches",
          },
        ],
      },
      {
        title: "Tasks",
        url:'/tasks',
        icon: Icons.Alphabet,
        items: [],
        permission: "tasks.view"
      },
      {
        title: "Settings",
        url:'/settings',
        icon: Icons.FourCircle,
        items: [],
        permission: "settings.view"
      },
    ],
  }
];
