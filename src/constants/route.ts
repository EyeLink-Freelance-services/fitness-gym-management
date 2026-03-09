export const ROUTES = {
  HOME: "/",
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
  }
//   USER: (id: string | number) => `/users/${id}`,
//   POST_EDIT: (id: string) => `/posts/${id}/edit`,
} as const;