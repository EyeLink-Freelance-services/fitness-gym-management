import * as Icons from "@/components/IconsCollection/icons";
import type {
  AnnouncementCardItem,
  AnnouncementFilters,
} from "@/types/dashboard/announcement";
import { DashboardOverviewItem } from "@/types/shared";

export const COMPANY_ANNOUNCEMENT_OVERVIEW: DashboardOverviewItem[] = [
  {
    label: "Total Sent",
    value: "34",
    trend: 6,
    note: "6 this month",
    Icon: Icons.Product,
  },
  {
    label: "Members Reached",
    value: "412",
    trend: 8.4,
    note: "All branches",
    Icon: Icons.Users,
  },
  {
    label: "Scheduled",
    value: "5",
    trend: 3.1,
    note: "Next in 2 days",
    Icon: Icons.Calendar,
  },
  {
    label: "Drafts",
    value: "3",
    trend: -1.5,
    note: "Unpublished",
    Icon: Icons.Views,
  },
];

export const COMPANY_ANNOUNCEMENT_FILTERS: AnnouncementFilters = {
  statuses: [
    { label: "All", value: "All", count: 7 },
    { label: "Published", value: "Published", count: 3 },
    { label: "Scheduled", value: "Scheduled", count: 2 },
    { label: "Drafts", value: "Draft", count: 2 },
  ],
  audiences: [
    "All Audiences",
    "All Members",
    "Premium Members",
    "New Joiners",
    "Morning Class Members",
  ],
  channels: ["All Channels", "Email", "App Push", "SMS"],
  priorities: ["All Priorities", "Urgent", "Normal", "Promotional"],
};

export const COMPANY_ANNOUNCEMENTS: AnnouncementCardItem[] = [
  {
    id: "ann-closure-mar-17",
    accent: "danger",
    priority: "Urgent",
    priorityTone: "danger",
    audience: "All Members",
    channels: [
      { code: "EM", label: "Email" },
      { code: "APP", label: "App Push" },
    ],
    status: "Published",
    statusTone: "success",
    title: "Gym Closure - 17 Mar (Public Holiday)",
    description:
      "All IronZone branches will be closed on 17 March 2026 in observance of the public holiday. Classes scheduled for that day will be automatically rescheduled.",
    meta: [
      { label: "Sent", value: "412" },
      { label: "Seen", value: "389" },
      { label: "Opened", value: "94%" },
    ],
    timestampLabel: "2 hours ago",
    actions: [],
  },
  {
    id: "ann-muay-thai-mar-10",
    accent: "primary",
    priority: "Normal",
    priorityTone: "primary",
    audience: "All Members",
    channels: [
      { code: "EM", label: "Email" },
      { code: "APP", label: "App Push" },
    ],
    status: "Published",
    statusTone: "success",
    title: "New Class: Muay Thai - Starting 10 March",
    description:
      "We're excited to launch our new Muay Thai classes every Monday and Wednesday at 7PM. Register through the app before Friday to secure your spot.",
    meta: [
      { label: "Sent", value: "412" },
      { label: "Seen", value: "341" },
      { label: "Opened", value: "83%" },
    ],
    timestampLabel: "Yesterday",
    actions: [],
  },
  {
    id: "ann-maintenance-mar-15",
    accent: "warning",
    priority: "Scheduled",
    priorityTone: "warning",
    audience: "All Members",
    channels: [
      { code: "EM", label: "Email" },
      { code: "APP", label: "App Push" },
    ],
    status: "Scheduled",
    statusTone: "warning",
    title: "Equipment Maintenance - 15 Mar (Reduced Access)",
    description:
      "Routine equipment servicing on 15 March. Some gym areas will have limited access from 6AM-12PM. We apologise for any inconvenience.",
    meta: [
      { label: "Sends", value: "15 Mar 8:00 AM" },
      { label: "Target", value: "412" },
    ],
    timestampLabel: "",
    actions: [
      {
        label: "Edit",
        variant: "outlineDark",
        toastMessage: "Announcement editor is not connected yet.",
      },
      {
        label: "Cancel",
        variant: "outlinePrimary",
        toastMessage: "Schedule cancellation is not connected yet.",
      },
    ],
  },
  {
    id: "ann-member-event-april",
    accent: "neutral",
    priority: "Draft",
    priorityTone: "neutral",
    audience: "Premium Members",
    channels: [{ code: "EM", label: "Email" }],
    status: "Draft",
    statusTone: "neutral",
    title: "Exclusive: Member Appreciation Event - April",
    description:
      "Draft: We're hosting an exclusive event for our Premium and Elite members in April. Details and RSVP link coming soon.",
    meta: [{ label: "Delivery", value: "Not yet sent" }],
    timestampLabel: "",
    actions: [
      {
        label: "Publish",
        variant: "primary",
        toastMessage: "Publish flow is not connected yet.",
      },
      {
        label: "Edit",
        variant: "outlineDark",
        toastMessage: "Announcement editor is not connected yet.",
      },
    ],
  },
  {
    id: "ann-ramadan-hours",
    accent: "warning",
    priority: "Scheduled",
    priorityTone: "warning",
    audience: "Morning Class Members",
    channels: [
      { code: "SMS", label: "SMS" },
      { code: "APP", label: "App Push" },
    ],
    status: "Scheduled",
    statusTone: "warning",
    title: "Ramadan Operating Hours Update",
    description:
      "Adjusted opening hours for the first two weeks of Ramadan. Morning class members will receive revised schedules and trainer allocations.",
    meta: [
      { label: "Sends", value: "12 Mar 6:30 PM" },
      { label: "Target", value: "128" },
    ],
    timestampLabel: "",
    actions: [
      {
        label: "Edit",
        variant: "outlineDark",
        toastMessage: "Announcement editor is not connected yet.",
      },
    ],
  },
  {
    id: "ann-new-member-onboarding",
    accent: "primary",
    priority: "Promotional",
    priorityTone: "primary",
    audience: "New Joiners",
    channels: [
      { code: "EM", label: "Email" },
      { code: "APP", label: "App Push" },
    ],
    status: "Published",
    statusTone: "success",
    title: "Welcome Pack + Free Assessment for New Members",
    description:
      "New joiners receive a complimentary body assessment and starter plan when they complete their profile within 48 hours of signup.",
    meta: [
      { label: "Sent", value: "86" },
      { label: "Seen", value: "63" },
      { label: "Opened", value: "78%" },
    ],
    timestampLabel: "3 days ago",
    actions: [],
  },
  {
    id: "ann-yoga-retreat-draft",
    accent: "neutral",
    priority: "Promotional",
    priorityTone: "primary",
    audience: "Premium Members",
    channels: [
      { code: "EM", label: "Email" },
      { code: "APP", label: "App Push" },
    ],
    status: "Draft",
    statusTone: "neutral",
    title: "Weekend Yoga Retreat Early Access",
    description:
      "Draft campaign for Premium members with early-bird access to the April yoga retreat, including member-only pricing and referral perks.",
    meta: [{ label: "Delivery", value: "Awaiting approval" }],
    timestampLabel: "",
    actions: [
      {
        label: "Publish",
        variant: "primary",
        toastMessage: "Publish flow is not connected yet.",
      },
      {
        label: "Edit",
        variant: "outlineDark",
        toastMessage: "Announcement editor is not connected yet.",
      },
    ],
  },
];
