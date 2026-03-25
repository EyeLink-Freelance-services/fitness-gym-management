export const ROUTES = {
  /** PUBLIC */
  ONBOARDING: {
    ACCEPT: "/onboarding/accept",
    AUTH: "/onboarding/auth",
    PROFILE: "/onboarding/profile",
    SUCCESS: "/onboarding/success"
  },
  LOGIN: "/auth/sign-in",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: {
    NEW_PASSWORD: "/auth/reset-password",
    NO_CODE_ERROR: "/reset?error=missing_code",
    INVALID_OR_EXPIRED: "/reset?error=invalid_or_expired"
  },

  /** PROTECTED */
  HOME: "/",
  DASHBOARD: {
    COMPANY: {
      ROOT: "/dashboard/company",
      // CLIENT_COACH_ASSIGN: "/dashboard/company/client-coach-assign",
      MEMBERSHIP: "/dashboard/company/membership",
      PAYMENT: "/dashboard/company/payment",
      COACH: "/dashboard/company/coach"
    },
    PERSONAL_COACH: {
      ROOT: "/dashboard/personal-coach",
      // ANNOUNCEMENTS: "/dashboard/personal-coach/announcements",
      // CLIENTS: "/dashboard/personal-coach/clients",
      // PROGRESS: "/dashboard/personal-coach/progress",
      // PROGRESS_CLIENT: (clientId: string) =>
      //   `/dashboard/personal-coach/progress/${clientId}`,
      // SCHEMA: "/dashboard/personal-coach/schema",
      // FORMULAS: "/dashboard/personal-coach/formulas",
    },
    SUPER_ADMIN: {
      ROOT: "/dashboard/super-admin",
    },
    CLIENT: {
      ROOT: "/dashboard/client",
      WEEKLY_CALENDAR: "/calendar"
    },
  },

  /** SUPER ADMIN */
  COMPANIES: "/companies",
  PERSONAL_COACHES: "/personal-coaches",
  SEND_ONBOARDING: "/send-onboarding",

  /** COMPANY */
  CLIENTS: {
    LIST_CLIENT: "/clients",
    ID: (id: string | number) => `/clients/${id}`
  },
  COACHES: {
    LIST_COACH: "/coaches",
    ID: (id: string | number) => `/coaches/${id}`
  },
  STAFF: {
    LIST_STAFF: "/staff",
    ID: (id: string | number) => `/staff/${id}`
  },

  /** COMPANY AND COACH */
  SCHEMA: "/schema",
  FORMULAS: "/formulas",
  // DATA_ENTRY: "/dashboard/company/data-entry",
  // PROGRESS: "/dashboard/company/progress",
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
  ANNOUNCEMENT: "/announcement",
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