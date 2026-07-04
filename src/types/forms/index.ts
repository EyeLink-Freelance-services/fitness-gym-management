import type { ReactNode } from "react";
import type { CoachMealTimeOption } from "@/types/dashboard/client";
import {
  CompanyClientFormValues,
  CompanyPricing,
} from "../dashboard/company";

export interface FormHeader {
  label: string;
  title: string;
  subtitle: string;
}

export interface FormLabel {
  value: ReactNode;
  as?: "span" | "label";
  htmlFor?: string;
  required?: boolean;
  className?: string;
  optional?: boolean;
}

export interface LoginFormData {
  username: string;
  password: string;
  contextType?: string;
  businessId?: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CompanyBranchField {
  branchName: string;
}

export interface CompanyFormData {
  companyName: string;
  logo?: string | null;
  email: string;
  brn: string;
  contactNumber: string;
  addressLine1: string;
  city: string;
  postcode: string;
  state: string;
  branches: CompanyBranchField[];
  disclaimer: string;
  standardPrice: number | undefined;
  agreeTerms: boolean;
}
export interface StaffFormData {
  gymBranch: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  role: string;
  notes?: string;
}

export interface CoachFormData {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  specialization?: string;
  coachingMode: string;
  location?: string;
  certifications?: string;
  hourlyRate: number;
  yearsExperience?: number;
  languages: string;
  bio: string;
  profilePhoto?: File | null;
  availability?: string;
}

export type FormSuccessCallback = () => void | Promise<void>;

export interface CoachFormProps {
  initialData?: Partial<CoachFormData>;
  existingProfilePhotoUrl?: string;
  mode?: "create" | "edit";
  coachId?: string;
  onSuccess?: FormSuccessCallback;
}

export interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>;
  existingProfilePhotoUrl?: string;
  mode?: "create" | "edit";
  companyId?: string;
  onSuccess?: FormSuccessCallback;
}

export interface CompanyStaffFormProps {
  initialData?: Partial<StaffFormData>;
  mode?: "create" | "edit";
  onSuccess?: FormSuccessCallback;
}

export interface CompanyClientFormProps {
  initialData?: Partial<CompanyClientFormValues>;
  clientContext?: "company";
  mode?: "create" | "edit";
  clientId?: string;
  companyPlan?: CompanyPricing | null;
  onSuccess?: FormSuccessCallback;
}

export interface AssignClientFormProps {
  initialData?: Partial<AssignClientFormData>;
  mode?: "create" | "edit";
  onSuccess?: FormSuccessCallback;
}

export type FormModalId = "client" | "company" | "coach" | "staff";

export interface AnnouncementFormData {
  title: string;
  message: string;
}

export interface CoachDietPlanMealFormData {
  timeSlot: CoachMealTimeOption;
  specificTime?: string;
  meal: string;
}

export interface CoachDietPlanFormData {
  clientId: string;
  clientName: string;
  meals: CoachDietPlanMealFormData[];
}

export interface CoachTrainingPlanFormData {
  clientId: string;
  clientName: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

/** Client-coach assignment status for Assign Client form */
export type AssignClientStatus = "assigned" | "pending" | "unassigned";

export interface AssignClientFormData {
  clientId: string;
  coachId: string;
  status: AssignClientStatus;
}

export type ValidateResult = true | string;

// Dashboard form

type FormType =
  | "client"
  | "company"
  | "coach"
  | "announcement"
  | "assignClient"
  | "staff";

export type FormModalTriggerProps = {
  buttonLabel: string;
  formType: FormType;
  clientContext?: "company";
  size?: "default" | "small" | "xs";
  companyPlan?: CompanyPricing | null;
  onSuccess?: FormSuccessCallback;
};
