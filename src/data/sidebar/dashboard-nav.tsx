import { NavSection } from "@/types/dashboard";
import * as Icons from "../../components/IconsCollection/icons";
import { section } from "@/utils/dashboard-nav";

export const SUPER_ADMIN_NAV: NavSection[] = [
  section("SUPER ADMIN", [
    {
      title: "Home",
      url: "/dashboard/super-admin",
      icon: Icons.User,
      items: [],
    },
    {
      title: "Companies",
      url: "/dashboard/super-admin/company",
      icon: Icons.User,
      items: [],
    },
    {
      title: "Personal Coaches",
      url: "/dashboard/super-admin/coaches",
      icon: Icons.TrainingIcon,
      items: [],
    },
  ]),
];

export const COMPANY_NAV: NavSection[] = [
  section("COMPANY", [
    {
      title: "Home",
      url: "/dashboard/company",
      icon: Icons.HomeIcon,
      items: [],
    },
    {
      title: "Members",
      icon: Icons.User,
      items: [
        {
          title: "Staff",
          url: "/dashboard/company/staff",
          icon: Icons.User,
        },
        {
          title: "Coaches",
          url: "/dashboard/company/coaches",
          icon: Icons.TrainingIcon,
        },
        {
          title: "Client",
          url: "/dashboard/company/clients",
          icon: Icons.TrainingIcon,
        },
      ],
    },
    {
      title: "Membership Plans",
      url: "/dashboard/company/membership",
      icon: Icons.PaymentsIcon,
      items: [],
    },
    {
      title: "Payment Records",
      url: "/dashboard/company/payment",
      icon: Icons.PaymentsIcon,
      items: [],
    },
    {
      title: "Announcements",
      url: "/dashboard/company/announcement",
      icon: Icons.Alphabet,
      items: [],
    },
  ]),
];

export const PERSONAL_COACH_NAV: NavSection[] = [
  section("PERSONAL COACH", [
    { title: "Clients", url: "/members", icon: Icons.User, items: [] },
    { title: "Sessions", url: "/calendar", icon: Icons.Calendar, items: [] },
    {
      title: "Diet Plans",
      url: "/diet-plans",
      icon: Icons.DietPlanIcon,
      items: [],
    },
    {
      title: "Communication & Announcements",
      url: "/announcement",
      icon: Icons.Alphabet,
      items: [],
    },
  ]),
];

export const CLIENT_NAV: NavSection[] = [
  section("COACH (GYM)", [
    { title: "Clients", url: "/members", icon: Icons.User, items: [] },
    { title: "Sessions", url: "/calendar", icon: Icons.Calendar, items: [] },
    { title: "Classes", url: "/calendar", icon: Icons.TrainingIcon, items: [] },
    { title: "Medical notes", url: "/members", icon: Icons.User, items: [] },
  ]),
];
