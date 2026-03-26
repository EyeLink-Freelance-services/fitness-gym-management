export const AuthPermission = {
  dashboard: {
    company: "dashboard.company.view",
    personalCoach: "dashboard.personal.view",
    companyCoach: "dashboard.company.coach.view",
    client: "dashboard.client.view",
    superAdmin: "dashboard.super_admin.view"
  },

  earnings: {
    view: "earnings.view",
    edit: "earnings.edit"
  },

  progress: {
    view: "progress.view",
    edit: "progress.edit"
  },

  dataEntry: {
    view: "data_entry.view",
    edit: "data_entry.edit"
  },

  schemaBuilder: {
    view: "schema_builder.view",
    edit: "schema_builder.edit",
  },

  formulaBuilder: {
    view: "formula_builder.view",
    edit: "formula_builder.edit",
  },

  clients: {
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

  coach: {
    view: "coach.view",
    edit: "coach.edit"
  },

  staff: {
    view: "staff.view",
    edit: "staff.edit"
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