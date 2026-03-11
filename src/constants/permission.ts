export const AuthPermission = {
  DASHBOARD_VIEW: "dashboard.view",
  MEMBERS_VIEW: "members.view",
  MEMBERS_EDIT: "members.edit",
  MEMBERSHIP_PLANS_VIEW: "membership_plans.view",
  MEMBERSHIP_PLANS_EDIT: "membership_plans.edit",
  TRAINING_PLANS_VIEW: "training_plans.view",
  TRAINING_PLANS_EDIT: "training_plans.edit",
  DIET_PLANS_VIEW: "diet_plans.view",
  DIET_PLANS_EDIT: "diet_plans.edit",
  CALENDAR_VIEW: "calendar.view",
  CALENDAR_EDIT: "calendar.edit",
  SERVICES_VIEW: "services.view",
  SERVICES_EDIT: "services.edit",
  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_EDIT: "payments.edit",
  ANNOUNCEMENTS_VIEW: "announcements.view",
  ANNOUNCEMENTS_EDIT: "announcements.edit",
  TASKS_VIEW: "tasks.view",
  TASKS_EDIT: "tasks.edit",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_EDIT: "settings.edit",
} as const;

export type AuthPermission =
  (typeof AuthPermission)[keyof typeof AuthPermission];