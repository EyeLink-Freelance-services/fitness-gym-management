export interface AvailableContextClaim {
  contextType?: string;
  businessId?: string;
  roles?: string[];
  permissions?: string[];
}

export interface AccessTokenClaims {
  sub?: string;
  exp?: number;
  iat?: number;
  userId?: string;
  email?: string;
  tokenType?: string;
  contextType?: string;
  businessId?: string;
  companyId?: string;
  clientId?: string;
  roles?: string[];
  permissions?: string[];
  availableContexts?: AvailableContextClaim[];
}
