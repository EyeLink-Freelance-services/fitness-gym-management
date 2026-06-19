export interface IAuthContext {
  userId: string;
  email: string;
  contextType?: string;
  clientId?: string | null;
  profile: IProfile;
  companyId: string | null;
  company: ICompany | null;
  isOwner: boolean;
  roles: string[];
  permissions: string[];
  availableContexts: IAvailableContext[];
}

export interface ICompanyUser {
  id: string;
  company_id: string;
  is_owner: boolean;
  joined_at: string;
  user_id: string;
}

export interface IProfile {
  id: string;
  first_name: string;
  last_name: string;
  picture_url: string;
  active_company_id: string | null;
}

export interface IRole {
  id: string;
  name: string;
}

export interface IPermission {
  id?: string;
  role_id?: string;
  role_name?: string;
  module: string;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
}

export interface ICompany {
  id: string;
  name: string;
  mode: "company" | "super-admin";
}

export interface IAvailableContext {
  contextType: string;
  businessId: string;
  roles?: string[];
  permissions?: string[];
}

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthResult<T> = {
  data: T;
  error: { message: string } | null;
};

export type RouteAuthClient = {
  auth: {
    getUser: () => Promise<AuthResult<{ user: AuthUser | null }>>;
  };
};

export interface LoginPayload {
  username: string;
  password: string;
  contextType?: string;
  businessId?: string | null;
}

export interface AuthApiResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiErrorBody {
  message?: string;
  error?: string;
  detail?: string;
  title?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}
