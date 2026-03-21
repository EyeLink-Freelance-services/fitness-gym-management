import type { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

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
  email: string;
  password: string;
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
  value: string;
}

export interface CompanyFormData {
  companyName: string;
  companyLogo?: FileList;
  brn: string;
  contactNumber: string;
  addressLine1: string;
  city: string;
  postcode: string;
  state: string;
  branches: CompanyBranchField[];
  disclaimer: string;
  agreeTerms: boolean;
}

export type UserType = "staff" | "coach";

export interface StaffCoachFormData {
  userType: UserType;
  gymBranch: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  role: string;
  accessLevel: string;
  notes?: string;
}

export interface PersonalCoachFormData {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  specialization: string;
  operatingLocation: string;
  certifications: string;
  yearsExperience: number;
  hourlyRate: number;
  languages: string;
  bio: string;
  profilePhoto?: FileList;
  availability: string;
}

export interface ClientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  emergencyContact: string;
  medicalConditions?: string;
  activityLevel: string;
  membershipPlan: string;
  assignedCoach: string;
  startDate: string;
  agreeTerms: boolean;
}

export interface LoginFormProps {
  onForgotPassword: () => void;
}

export interface RecoveryFormProps {
  step: number;
  onBackToLogin: () => void;
}

export interface CompanyFormProps {
  onBackToLogin: () => void;
}

export interface StaffCoachFormProps {
  onPersonalCoach: () => void;
}

export type FormModalId = "client" | "company" | "personal" | "staff";

export interface AnnouncementFormData {
  title: string;
  message: string;
  sendType: "now" | "schedule";
  scheduledDate?: string | null;
}

export interface MedicalNoteFormData {
  clientId: string;
  condition: string;
  restrictionNotes: string;
  severity: "high" | "moderate" | "low";
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
  | "assignClient";

export type FormModalTriggerProps = {
  buttonLabel: string;
  formType: FormType;
  size?: "default" | "small" | "xs";
};