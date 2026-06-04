import type { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
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

export interface RecoveryRegisteredEmailFormData {
  email: string;
}

export interface RecoveryStep2FormData {
  code: string;
}

export interface RecoveryNewPasswordFormData {
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

export interface PersonalCoachFormData {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  specialization: string;
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

export interface CompanyCoachFormData {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  specialization: string;
  coachingMode: string;
  location?: string;
  certifications?: string;
  hourlyRate: number;
  yearsExperience?: number;
  languages: string;
  bio: string;
  profilePhoto?: FileList;
  availability?: string;
}

export interface PersonalCoachFormProps {
  initialData?: Partial<PersonalCoachFormData>;
  existingProfilePhotoUrl?: string;
  mode?: "create" | "edit";
  context?: "super-admin" | "company";
  onSuccess?: () => void;
}

export interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>;
  existingProfilePhotoUrl?: string;
  mode?: "create" | "edit";
  companyId?: string;
  onSuccess?: () => void;
}

export interface CompanyStaffFormProps {
  initialData?: Partial<StaffFormData>;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export interface CompanyClientFormProps {
  initialData?: Partial<CompanyClientFormValues>;
  clientContext?: "company" | "personal";
  mode?: "create" | "edit";
  clientId?: string;
  companyPlan?: CompanyPricing | null;
  onSuccess?: () => void;
}

export interface AssignClientFormProps {
  initialData?: Partial<AssignClientFormData>;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export type ClientFormData = CompanyClientFormValues;

export interface LoginFormProps {
  onForgotPassword: () => void;
}

export interface RecoveryFormProps {
  step: number;
  onBackToLogin: () => void;
  resetToken?: string | null;
}

export interface StaffCoachFormProps {
  onPersonalCoach: () => void;
}

export type FormModalId = "client" | "company" | "personal" | "staff";

export interface AnnouncementFormData {
  title: string;
  message: string;
}

export interface MedicalNoteFormData {
  clientId: string;
  condition: string;
  restrictionNotes: string;
  severity: "high" | "moderate" | "low";
}

export interface PersonalCoachDietPlanMealFormData {
  timeSlot: CoachMealTimeOption;
  specificTime?: string;
  meal: string;
}

export interface PersonalCoachDietPlanFormData {
  clientId: string;
  clientName: string;
  meals: PersonalCoachDietPlanMealFormData[];
}

export interface PersonalCoachTrainingPlanFormData {
  clientId: string;
  clientName: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  repeatEveryWeek: boolean;
  repeatEveryMonth: boolean;
}

/** Client-coach assignment status for Assign Client form */
export type AssignClientStatus = "assigned" | "pending" | "unassigned";

export interface AssignClientFormData {
  clientId: string;
  coachId: string;
  status: AssignClientStatus;
}

export type ValidateResult = true | string;

/* Recover Password */

export type RegisteredEmailConfirmations = {
  form: UseFormReturn<RecoveryRegisteredEmailFormData>;
  onNext: (data: RecoveryRegisteredEmailFormData) => void;
  onBackToLogin: () => void;
};

export type PasswordRecoverySuccess = {
  goToApp: () => void;
};

export type NewPasswordProps = {
  form: UseFormReturn<RecoveryNewPasswordFormData>;
  onNext: (values: RecoveryNewPasswordFormData) => void;
};

export type RecoveryCodeProps = {
  form: UseFormReturn<RecoveryStep2FormData>;
  recoverEmail: string;
  onNext: () => void;
  onResend: () => void;
};

// Dashboard form

type FormType =
  | "client"
  | "company"
  | "personal"
  | "announcement"
  | "medicalNotes"
  | "assignClient"
  | "staff";

export type FormModalTriggerProps = {
  buttonLabel: string;
  formType: FormType;
  clientContext?: "company" | "personal";
  coachContext?: "super-admin" | "company";
  size?: "default" | "small" | "xs";
  companyPlan?: CompanyPricing | null;
  onSuccess?: () => void;
};
