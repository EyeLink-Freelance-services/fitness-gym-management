export const ROUTES = {
  HOME: "/",
  DASHBOARD: {
    COMPANY: {
      ROOT: "/dashboard/company",
      ANNOUNCEMENT: "/dashboard/company/announcement",
      // CLIENT_COACH_ASSIGN: "/dashboard/company/client-coach-assign",
      CLIENTS: "/dashboard/company/clients",
      CLIENT_PROFILE: (clientId: string) =>
        `/dashboard/company/clients/${clientId}`,
      CLIENT_DATA_ENTRY: (clientId: string) =>
        `/dashboard/company/clients/${clientId}/data-entry`,
      COACHES: "/dashboard/company/coaches",
      MEMBERSHIP: "/dashboard/company/membership",
      PAYMENT: "/dashboard/company/payment",
      // STAFF: "/dashboard/company/staff",
      SCHEMA: "/dashboard/company/schema",
      FORMULAS: "/dashboard/company/formulas",
      PROGRESS: "/dashboard/company/progress",
      SESSIONS: "/dashboard/company/sessions",
    },
    SUPER_ADMIN: {
      ROOT: "/dashboard/super-admin",
      COMPANY: "/dashboard/super-admin/company"
    },
  },
  LOGIN: "/auth/sign-in",
  MEMBERS: {
    LIST_MEMBER: '/members',
    NEW_MEMBER: '/members/new',
    ID: (id: string | number) => `/members/${id}`
  },
  MEMBERSHIP: {
    LIST_MEMBERSHIP: '/membership-plans',
    NEW_MEMBERSHIP: '/membership-plans/new',
    EDIT_MEMBERSHIP: (id: string | number) => `/membership-plans/${id}/edit`,
    ID: (id: string | number) => `/membership-plans/${id}`
  },
  TRAINING_PLANS: {
    TEMPLATES: '/training-plans',
    NEW_TEMPLATES: '/training-plans/new',
    EDIT_TEMPLATES: (id: string | number) => `/training-plans/${id}/edit`,
    ID: (id: string | number) => `/training-plans/${id}`
  },
  DIET_PLANS: {
    TEMPLATES: '/diet-plans',
    NEW_TEMPLATES: '/diet-plans/new',
    EDIT_TEMPLATES: (id: string | number) => `/diet-plans/${id}/edit`,
    ID: (id: string | number) => `/diet-plans/${id}`
  },
  CALENDAR: '/calendar',
  PAYMENTS: {
    LIST_PAYMENTS: '/payments',
    NEW_PAYMENT: '/payments/new',
    EDIT_PAYMENT: (id: string | number) => `/payments/${id}/edit`,
    ID: (id: string | number) => `/payments/${id}`
  }, 
  SERVICES: '/additional-services', 
  TASKS: {
    LIST_TASKS: '/tasks',
    NEW_TASKS: '/tasks/new',
    EDIT_TASKS: (id: string | number) => `/tasks/${id}/edit`,
    ID: (id: string | number) => `/tasks/${id}`
  }, 
  SETTINGS: '/settings', 
} as const;