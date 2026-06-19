import type {
  CompanyClient,
  CompanyClientFormValues,
  CompanyStaffRow,
} from "@/types/dashboard/company";
import { buildCompanyClientRows } from "@/utils/dashboard/company-client-rows";

export const PENDING_COACH = [
  {
    name: "New User",
    joined: "Mar 2",
  },
];

export const membershipPlanOptions = [
  { value: "standard", label: "Standard" },
  { value: "personalCoach", label: "Personal Coaching" },
];


export const GYM_CLIENTS: CompanyClient[] = [
  // {
  //   id: "client-1",
  //   name: "Alex Brown",
  //   contact: "0435123456",
  //   plan: "Personal Coaching",
  //   price: 123,
  //   joinedAt: "2024-01-10",
  //   expiresAt: "2026-04-20",
  //   coach: "John Smith",
  //   assignedOn: "2024-01-10",
  //   status: "Assigned",
  // },
  // {
  //   id: "client-2",
  //   name: "Jordan Lee",
  //   contact: "0498765432",
  //   plan: "Standard",
  //   price: 150,
  //   joinedAt: "2025-09-15",
  //   expiresAt: "2026-03-26",
  //   coach: "John Smith",
  //   assignedOn: "2025-09-15",
  //   status: "Assigned",
  // },
];

export const COMPANY_CLIENT_ROWS = buildCompanyClientRows(GYM_CLIENTS);

export const COMPANY_STAFF_ROWS: CompanyStaffRow[] = [
  {
    id: "staff-1",
    first_name: "Ava",
    last_name: "Naidoo",
    gym_name: "MyFit - Trianon",
    phone_num: "+230 5901 2234",
    email: "ava.naidoo@myfit.com",
    role: "Receptionist",
    notes: "Handles front desk and daily member inquiries.",
    status: "Active",
  },
  {
    id: "staff-2",
    first_name: "Ryan",
    last_name: "Pillay",
    gym_name: "MyFit - Trianon",
    phone_num: "+230 5933 7788",
    email: "ryan.pillay@myfit.com",
    role: "Operations Manager",
    notes: "Oversees branch operations and shift planning.",
    status: "Active",
  },
  {
    id: "staff-3",
    first_name: "Mia",
    last_name: "Ramlall",
    gym_name: "MyFit - Trianon",
    phone_num: "+230 5755 8811",
    email: "mia.ramlall@myfit.com",
    role: "Sales Executive",
    notes: "Focuses on membership conversions and renewals.",
    status: "Inactive",
  },
];

export const DEFAULT_CLIENT_FORM_VALUES: CompanyClientFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  phoneNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  medicalConditions: "",
  membershipPlan: "standard",
  additionalFees: undefined,
  assignedCoach: "",
  startDate: new Date().toISOString().split("T")[0],
  agreeTermsOfService: true,
};
