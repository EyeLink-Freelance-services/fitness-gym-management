import type { PersonalCoachFormData } from "@/types/forms";
import type { CompanyCoachesRow } from "@/types/dashboard/company";
import type {
  CoachAvailability,
  CoachRequestApiBean,
  CoachResponseApiBean,
  CoachingMode,
} from "@/types/dashboard/coach";

const COACHING_MODE_TO_DISPLAY: Record<CoachingMode, string> = {
  IN_PERSON: "In-person",
  ONLINE: "Online",
  HYBRID: "Hybrid",
};

const DISPLAY_TO_COACHING_MODE: Record<string, CoachingMode> = {
  "In-person": "IN_PERSON",
  Online: "ONLINE",
  Hybrid: "HYBRID",
};

const AVAILABILITY_TO_DISPLAY: Record<CoachAvailability, string> = {
  WEEKDAYS: "Weekdays Only",
  WEEKEND: "Weekends Only",
  WEEKDAYS_WEEKEND: "Weekdays & Weekends",
  FLEXIBLE: "Flexible / On Request",
};

const DISPLAY_TO_AVAILABILITY: Record<string, CoachAvailability> = {
  "Weekdays Only": "WEEKDAYS",
  "Weekends Only": "WEEKEND",
  "Weekdays & Weekends": "WEEKDAYS_WEEKEND",
  "Flexible / On Request": "FLEXIBLE",
  "Assigned by company": "FLEXIBLE",
};

function splitCommaList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinCommaList(values?: string[]): string {
  return values?.join(", ") ?? "";
}

function mapCoachingModeToDisplay(mode?: CoachingMode): string {
  if (!mode) return "";
  return COACHING_MODE_TO_DISPLAY[mode] ?? mode;
}

function mapAvailabilityToDisplay(availability?: CoachAvailability): string {
  if (!availability) return "";
  return AVAILABILITY_TO_DISPLAY[availability] ?? availability;
}

export function getCompanyCoachFullName(
  coach: Pick<CompanyCoachesRow, "first_name" | "last_name">,
): string {
  return `${coach.first_name} ${coach.last_name}`.trim() || "Coach";
}

export function mapCoachResponseToCompanyCoachesRow(
  api: CoachResponseApiBean,
): CompanyCoachesRow {
  const certifications = splitCommaList(api.details?.certifications);

  return {
    id: api.id,
    first_name: api.information?.firstName ?? "",
    last_name: api.information?.lastName ?? "",
    phone_num: api.contact?.contactNumber ?? "",
    email: api.contact?.email ?? "",
    specialization: certifications[0] ?? "",
    coaching_mode: mapCoachingModeToDisplay(api.details?.coachingMode),
    location: api.information?.location ?? "",
    qualifications: api.details?.certifications ?? "",
    certifications,
    years_of_experience: api.details?.yearsOfExperience ?? 0,
    hourly_rate: api.details?.hourlyRate ?? 0,
    languages_spoken: splitCommaList(api.details?.spokenLanguages),
    bio: api.details?.biography ?? "",
    profile_photo: api.information?.picture ?? null,
    availability: mapAvailabilityToDisplay(api.details?.availability),
    createdAt: api.auditData?.createdDate ?? "",
  };
}

export function mapCompanyCoachesRowToFormValues(
  coach: CompanyCoachesRow,
): PersonalCoachFormData {
  return {
    firstName: coach.first_name,
    lastName: coach.last_name,
    contactNumber: coach.phone_num,
    email: coach.email,
    specialization: coach.specialization ?? "",
    coachingMode: coach.coaching_mode || "In-person",
    location: coach.location,
    certifications: joinCommaList(coach.certifications),
    hourlyRate: coach.hourly_rate,
    yearsExperience: coach.years_of_experience,
    languages: joinCommaList(coach.languages_spoken),
    bio: coach.bio,
    availability: coach.availability,
  };
}

export function mapCoachFormToApiRequest(
  form: PersonalCoachFormData,
): CoachRequestApiBean {
  const trimmedEmail = (form.email ?? "").trim();

  if (!trimmedEmail) {
    throw new Error("Coach email is required and cannot be empty");
  }

  const coachingMode =
    DISPLAY_TO_COACHING_MODE[form.coachingMode] ?? "IN_PERSON";
  const availability =
    DISPLAY_TO_AVAILABILITY[form.availability ?? ""] ?? "FLEXIBLE";

  return {
    information: {
      firstName: form.firstName,
      lastName: form.lastName,
      picture:
        typeof form.profilePhoto === "string" ? form.profilePhoto : undefined,
      location: form.location,
    },
    contact: {
      email: trimmedEmail,
      contactNumber: form.contactNumber,
    },
    details: {
      coachingMode,
      availability,
      yearsOfExperience: form.yearsExperience ?? undefined,
      spokenLanguages: form.languages,
      biography: form.bio,
      hourlyRate: form.hourlyRate ?? 0,
      certifications: form.certifications,
    },
  };
}
