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
      COACHES: "/dashboard/company/coaches",
      MEMBERSHIP: "/dashboard/company/membership",
      PAYMENT: "/dashboard/company/payment",
      STAFF: "/dashboard/company/staff",
      SCHEMA: "/dashboard/company/schema",
      FORMULAS: "/dashboard/company/formulas",
      DATA_ENTRY: "/dashboard/company/data-entry",
      PROGRESS: "/dashboard/company/progress",
      SESSIONS: "/dashboard/company/sessions",
    },
    PERSONAL_COACH: {
      ROOT: "/dashboard/personal-coach",
      SESSIONS: "/dashboard/personal-coach/sessions",
      ANNOUNCEMENTS: "/dashboard/personal-coach/announcements",
      CLIENTS: "/dashboard/personal-coach/clients",
      TRAINING_PLAN: "/dashboard/personal-coach/training-plan",
      DIET_PLAN: "/dashboard/personal-coach/diet-plan",
      DATA_ENTRY: "/dashboard/personal-coach/data-entry",
      PROGRESS: "/dashboard/personal-coach/progress",
      PROGRESS_CLIENT: (clientId: string) =>
        `/dashboard/personal-coach/progress/${clientId}`,
      SCHEMA: "/dashboard/personal-coach/schema",
      FORMULAS: "/dashboard/personal-coach/formulas",
    },
    SUPER_ADMIN: {
      ROOT: "/dashboard/super-admin",
      COACHES: "/dashboard/super-admin/coaches",
      COMPANY: "/dashboard/super-admin/company"
    },
    CLIENT: {
      ROOT: "/dashboard/client",
      SESSIONS: "/dashboard/client/sessions",
      WEEKLY_CALENDAR: "/dashboard/client/sessions",
    },
  },
  LOGIN: "/auth/sign-in",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: {
    NEW_PASSWORD: "/auth/reset-password",
    NO_CODE_ERROR: "/reset?error=missing_code",
    INVALID_OR_EXPIRED: "/reset?error=invalid_or_expired"
  },
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