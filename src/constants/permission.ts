export const AuthPermission = {
  dashboard: {
    company: "dashboard.company.view",
    client: "dashboard.client.view",
    personalCoach: "dashboard.personal_coach.view",
    superAdmin: "dashboard.super_admin.view"
  },

  members: {
    view: "members.view",
    edit: "members.edit",
  },

  membershipPlans: {
    view: "membership_plans.view",
    edit: "membership_plans.edit",
  },

  trainingPlans: {
    view: "training_plans.view",
    edit: "training_plans.edit",
  },

  dietPlans: {
    view: "diet_plans.view",
    edit: "diet_plans.edit",
  },

  calendar: {
    view: "calendar.view",
    edit: "calendar.edit",
  },

  services: {
    view: "services.view",
    edit: "services.edit",
  },

  payments: {
    view: "payments.view",
    edit: "payments.edit",
  },

  announcements: {
    view: "announcements.view",
    edit: "announcements.edit",
  },

  management: {
    users: "management.users.view",
    staff: "dashboard.client.view",
    personalCoach: "dashboard.personal_coach.view",
  },

  tasks: {
    view: "tasks.view",
    edit: "tasks.edit",
  },

  settings: {
    view: "settings.view",
    edit: "settings.edit",
  },
} as const;