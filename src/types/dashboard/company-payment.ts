import type { AuditableApiBean, MembershipPlan } from "./shared";

export type ClientPaymentSearchSortField =
  | "BILLING_MONTH"
  | "CREATION_DATE"
  | "STANDARD_PRICE"
  | "ADDITIONAL_FEES";

export interface ClientPaymentResponseApiBean {
  id?: string;
  clientId?: string;
  firstName?: string;
  lastName?: string;
  membershipPlan?: MembershipPlan;
  billingMonth?: string;
  amount?: number;
  standardPrice?: number;
  additionalFees?: number;
  auditData?: AuditableApiBean;
}

export interface SearchClientPaymentsApiBean {
  payments?: ClientPaymentResponseApiBean[];
  pageSize?: number;
  pageNumber?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface PaymentRequestApiBean {
  billingMonth: string;
}

export interface CompanyPaymentRow {
  id: string;
  clientId: string;
  clientName: string;
  membershipPlan: MembershipPlan;
  billingMonth: string;
  amount: number;
  standardPrice?: number;
  additionalFees?: number;
  paidDate?: string;
  isPaid: boolean;
}

export interface CompanyPaymentsTableClientProps {
  initialData: CompanyPaymentRow[];
  totalCount: number;
  billingMonth: string;
}
