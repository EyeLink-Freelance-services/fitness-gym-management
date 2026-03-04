import * as Icons from "../../components/Layouts/sidebar/icons";

type SubItem = { title: string; url: string };
type NavItem = {
  title: string;
  url?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  items: SubItem[];
};
type NavSection = { label: string; items: NavItem[] };

function section(label: string, items: NavItem[]): NavSection {
  return { label, items };
}

const SUPER_ADMIN_NAV: NavSection[] = [
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
      title: "Coaches",
      url: "/dashboard/super-admin/coaches",
      icon: Icons.TrainingIcon,
      items: [],
    },
  ]),
];

const COMPANY_NAV: NavSection[] = [
  section("COMPANY", [
    {
      title: "Overview",
      url: "/dashboard/company",
      icon: Icons.HomeIcon,
      items: [],
    },
    {
      title: "Members",
      url: "/dashboard/company/members",
      icon: Icons.User,
      items: [],
    },
    {
      title: "Coaches",
      url: "/dashboard/company/coaches",
      icon: Icons.TrainingIcon,
      items: [],
    },
    { title: "Calendar", url: "/calendar", icon: Icons.Calendar, items: [] },
    {
      title: "Payment Records",
      url: "/payments",
      icon: Icons.PaymentsIcon,
      items: [],
    },
    {
      title: "Communication & Announcements",
      url: "/announcement",
      icon: Icons.Alphabet,
      items: [],
    },
    { title: "Settings", url: "/settings", icon: Icons.FourCircle, items: [] },
  ]),
];

const PERSONAL_COACH_NAV: NavSection[] = [
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

const CLIENT_NAV: NavSection[] = [
  section("COACH (GYM)", [
    { title: "Clients", url: "/members", icon: Icons.User, items: [] },
    { title: "Sessions", url: "/calendar", icon: Icons.Calendar, items: [] },
    { title: "Classes", url: "/calendar", icon: Icons.TrainingIcon, items: [] },
    { title: "Medical notes", url: "/members", icon: Icons.User, items: [] },
  ]),
];

export function getDashboardNav(pathname: string): NavSection[] {
  if (pathname.startsWith("/dashboard/super-admin")) return SUPER_ADMIN_NAV;
  if (pathname.startsWith("/dashboard/company")) return COMPANY_NAV;
  if (pathname.startsWith("/dashboard/personal-coach"))
    return PERSONAL_COACH_NAV;
  if (pathname.startsWith("/dashboard/client")) return CLIENT_NAV;
  return [];
}
