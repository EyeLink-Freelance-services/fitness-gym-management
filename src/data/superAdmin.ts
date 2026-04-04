import {
  Users,
  Gym,
  Trainer,
  Profit,
} from "@/components/IconsCollection/icons";

const logos = {
  google: "/images/logo/google.svg",
  x: "/images/logo/x.svg",
  github: "/images/logo/github.svg",
  vimeo: "/images/logo/vimeo.svg",
  facebook: "/images/logo/facebook.svg",
} as const;

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
    firstName: "Nachiket",
    lastName: "Joyekurun",
    contactNumber: "59054043",
    email: "njoyekurun@gmail.com",
    specialization: "Yoga & Mindfulness",
    coachingMode: "Online",
    location: "",
    certifications: "",
    yearsExperience: "",
    hourlyRate: 0,
    availability: "",
    languages: "sdsd",
    bio: "BRe",
    profilePhoto: logos.google,
    status: "Active",
    createdAt: "2024-01-10",
  },
  {
    firstName: "Nac",
    lastName: "Joy",
    contactNumber: "5826",
    email: "njoye@gmail.com",
    specialization: "Strength",
    coachingMode: "In-Person",
    location: "Port-Louis",
    certifications: "NASM, Cross Fit L2",
    yearsExperience: "12",
    hourlyRate: 123,
    availability: "Weekdays Only",
    languages: "Creole, English",
    bio: "Brief bio about the coach goes here. It can include their coaching philosophy, experience, and any other relevant information that potential clients might find useful when deciding to work with them.",
    profilePhoto: logos.google,
    status: "Inactive",
    createdAt: "2024-03-10",
  },
  {
    firstName: "Ovi",
    lastName: "Joy",
    contactNumber: "5123",
    email: "ovijoy@gmail.com",
    specialization: "Strength",
    coachingMode: "In-Person",
    location: "Port-Louis",
    certifications: "NASM, Cross Fit L2",
    yearsExperience: "12",
    hourlyRate: 123,
    availability: "Weekdays Only",
    languages: "Creole, English",
    bio: "Brief bio about the coach goes here.Other relevant information that potential clients might find useful when deciding to work with them.",
    profilePhoto: logos.google,
    status: "Disabled",
    createdAt: "2025-01-10",
  },
];

export const OVERVIEW_SUPER_ADMIN_DATA = [
  {
    name: "Totals Users",
    value: 6,
    growthRate: -0.95,
    icon: Users,
  },
  {
    name: "Total Companies",
    value: 3,
    growthRate: 0.43,
    icon: Gym,
  },
  {
    name: "Total Coaches",
    value: 3,
    growthRate: 4.35,
    icon: Trainer,
  },
  {
    name: "Revenue",
    value: 3456,
    growthRate: 2.59,
    icon: Profit,
  },
];

export const DUMMY_GYMS = [
  {
    companyName: "MyFit",
    companyLogo: {},
    brn: "23232332",
    contactNumber: "59054043",
    addressLine1: "Unit 3, 41-45 Glebe Street",
    city: "Forest Hill",
    postcode: "3131",
    state: "Grand Port",
    branches: [
      {
        value: "",
      },
    ],
    standardPrice: 150,
    hasPremiumPlan: true,
    premiumPrice: 250,
    disclaimer: "A simple disclaimer text",
    agreeTerms: true,
    status: "Active",
    createdAt: "2023-01-10",
  },
  {
    companyName: "YourFit",
    companyLogo: logos.google,
    brn: "23238332",
    contactNumber: "5982643",
    addressLine1: "Unit 3, 41-45 Glebe Street",
    city: "Forest Hill",
    postcode: "3131",
    state: "Moka",
    branches: [
      {
        value: "ST-Pierre",
      },
    ],
    standardPrice: 175,
    hasPremiumPlan: false,
    premiumPrice: undefined,
    disclaimer: "A simple disclaimer text",
    agreeTerms: true,
    status: "Active",
    createdAt: "2024-01-10",
  },
  {
    companyName: "OurFit",
    companyLogo: logos.x,
    brn: "23234782",
    contactNumber: "5922643",
    addressLine1: "Unit 3, 41-45 Glebe Street",
    city: "Forest Hill",
    postcode: "3131",
    state: "Quatre Bornes",
    branches: [
      {
        value: "Belle Roese",
      },
      {
        value: "St-Jean",
      },
    ],
    standardPrice: 180,
    hasPremiumPlan: true,
    premiumPrice: 300,
    disclaimer: "A simple disclaimer text",
    agreeTerms: true,
    status: "Active",
    createdAt: "2025-01-10",
  },
];
