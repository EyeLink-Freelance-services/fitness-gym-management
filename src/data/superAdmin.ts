import * as logos from "@/assets/logos";
import { Users, Gym, Trainer, Profit } from "@/components/IconsCollection/icons";

export async function getInvoiceTableData() {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return [
    {
      name: "Free package",
      price: 0.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Business Package",
      price: 99.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Unpaid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Pending",
    },
  ];
}

export async function getTopChannels() {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.google,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.x,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.github,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.vimeo,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.facebook,
    },
  ];
}

export async function getOverviewData() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    users: {
      value: 3456,
      growthRate: -0.95,
    },
    views: {
      value: 3456,
      growthRate: 0.43,
    },
    profit: {
      value: 4220,
      growthRate: 4.35,
    },
    products: {
      value: 3456,
      growthRate: 2.59,
    },
  };
}

export async function getChatsData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}

export async function getPaymentsOverviewData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      received: [
        { x: 2020, y: 450 },
        { x: 2021, y: 620 },
        { x: 2022, y: 780 },
        { x: 2023, y: 920 },
        { x: 2024, y: 1080 },
      ],
      due: [
        { x: 2020, y: 1480 },
        { x: 2021, y: 1720 },
        { x: 2022, y: 1950 },
        { x: 2023, y: 2300 },
        { x: 2024, y: 1200 },
      ],
    };
  }

  return {
    received: [
      { x: "Jan", y: 0 },
      { x: "Feb", y: 20 },
      { x: "Mar", y: 35 },
      { x: "Apr", y: 45 },
      { x: "May", y: 35 },
      { x: "Jun", y: 55 },
      { x: "Jul", y: 65 },
      { x: "Aug", y: 50 },
      { x: "Sep", y: 65 },
      { x: "Oct", y: 75 },
      { x: "Nov", y: 60 },
      { x: "Dec", y: 75 },
    ],
    due: [
      { x: "Jan", y: 15 },
      { x: "Feb", y: 9 },
      { x: "Mar", y: 17 },
      { x: "Apr", y: 32 },
      { x: "May", y: 25 },
      { x: "Jun", y: 68 },
      { x: "Jul", y: 80 },
      { x: "Aug", y: 68 },
      { x: "Sep", y: 84 },
      { x: "Oct", y: 94 },
      { x: "Nov", y: 74 },
      { x: "Dec", y: 62 },
    ],
  };
}

export async function getWeeksProfitData(timeFrame?: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "last week") {
    return {
      sales: [
        { x: "Sat", y: 33 },
        { x: "Sun", y: 44 },
        { x: "Mon", y: 31 },
        { x: "Tue", y: 57 },
        { x: "Wed", y: 12 },
        { x: "Thu", y: 33 },
        { x: "Fri", y: 55 },
      ],
      revenue: [
        { x: "Sat", y: 10 },
        { x: "Sun", y: 20 },
        { x: "Mon", y: 17 },
        { x: "Tue", y: 7 },
        { x: "Wed", y: 10 },
        { x: "Thu", y: 23 },
        { x: "Fri", y: 13 },
      ],
    };
  }

  return {
    sales: [
      { x: "Sat", y: 44 },
      { x: "Sun", y: 55 },
      { x: "Mon", y: 41 },
      { x: "Tue", y: 67 },
      { x: "Wed", y: 22 },
      { x: "Thu", y: 43 },
      { x: "Fri", y: 65 },
    ],
    revenue: [
      { x: "Sat", y: 13 },
      { x: "Sun", y: 23 },
      { x: "Mon", y: 20 },
      { x: "Tue", y: 8 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 27 },
      { x: "Fri", y: 15 },
    ],
  };
}

export const DUMMY_COACHES = [
  {
    name: "Alex",
    logo: logos.google,
    specialization: "Strength Training",
    clients: 3456,
    status: "Active",
    location: "New York, USA",
  },
  {
    name: "Alex",
    logo: logos.x,
    specialization: "Strength Training",
    clients: 356,
    status: "Active",
    location: "New York, USA",
  },
  {
    name: "Alex",
    logo: logos.github,
    specialization: "Cardio",
    clients: 456,
    status: "Active",
    location: "New York, USA",
  },
  {
    name: "Alex",
    logo: logos.vimeo,
    specialization: "Training",
    clients: 3456,
    status: "Active",
    location: "New York, USA",
  },
  {
    name: "Alex",
    logo: logos.facebook,
    specialization: "Strength",
    clients: 3450,
    status: "Active",
    location: "New York, USA",
  },
];

export const OVERVIEW_SUPER_ADMIN_DATA = [
  {
    name: "users",
    value: 3456,
    growthRate: -0.95,
    icon: Users,
  },
  {
    name: "company",
    value: 3456,
    growthRate: 0.43,
    icon: Gym,
  },
  {
    name: "coach",
    value: 4220,
    growthRate: 4.35,
    icon: Trainer,
  },
  {
    name: "revenue",
    value: 3456,
    growthRate: 2.59,
    icon: Profit,
  },
];

export const DUMMY_GYMS = [
  {
    id: 1,
    name: "MyFit",
    logo: logos.google,
    clients: 3456,
    location: "New York, USA",
    status: "Active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "MyFit",
    logo: logos.x,
    clients: 3456,
    location: "USA",
    status: "Active",
    createdAt: "2024-02-10",
  },
  {
    id: 3,
    name: "MyFit",
    logo: logos.github,
    clients: 3456,
    location: "Mauritius",
    status: "Active",
    createdAt: "2024-04-10",
  },
  {
    id: 4,
    name: "MyFit",
    logo: logos.vimeo,
    clients: 3456,
    location: "Port Louis",
    status: "Active",
    createdAt: "2024-06-10",
  },
  {
    id: 5,
    name: "MyFit",
    logo: logos.facebook,
    clients: 3456,
    location: "New York, USA",
    status: "Active",
    createdAt: "2024-07-10",
  },
  {
    id: 5,
    name: "MyFit",
    logo: logos.facebook,
    clients: 3456,
    location: "New York, USA",
    status: "Active",
    createdAt: "2026-02-10",
  },
];
