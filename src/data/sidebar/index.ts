import * as Icons from "../../components/Layouts/sidebar/icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Members",
        url:'/members',
        icon: Icons.User,
        items: [],
      },
      {
        title: "Membership Plans",
        url:'/membership-plans',
        icon: Icons.User,
        items: [],
      },
      {
        title: "Training Plans",
        url: "/training-plans",
        icon: Icons.TrainingIcon,
        items: []
      },
      {
        title: "Diet Plans",
        url: "/diet-plans",
        icon: Icons.DietPlanIcon,
        items: [],
      },
      {
        title: "Calendar & Schedule",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Payment records",
        url: "/payments",
        icon: Icons.PaymentsIcon,
        items: [],
      },
      {
        title: "Additional Services",
        url:'/additional-services',
        icon: Icons.AdditionalServicesIcon,
        items: [],
      },
      {
        title: "Communication & Announcement",
        url: "/announcement",
        icon: Icons.Alphabet,
        items: [],
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
      },
      {
        title: "Settings",
        url:'/settings',
        icon: Icons.FourCircle,
        items: [],
      },
    ],
  }
];
