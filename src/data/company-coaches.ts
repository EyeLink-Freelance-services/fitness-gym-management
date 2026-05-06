import type { CompanyCoachesRow } from "@/types/dashboard/company";
import { DUMMY_COACHES } from "@/data/superAdmin";
import type { StatusOpt } from "@/types/dashboard/super-admin";

export const COMPANY_COACH_ROWS: CompanyCoachesRow[] = DUMMY_COACHES.map(
  (coach, index) => ({
    id: `coach-${index + 1}`,
    first_name: coach.firstName,
    last_name: coach.lastName,
    phone_num: coach.contactNumber,
    email: coach.email,
    specialization: coach.specialization,
    coaching_mode: coach.coachingMode,
    location: coach.location,
    qualifications: coach.certifications,
    certifications: coach.certifications
      ? coach.certifications.split(",").map((item) => item.trim())
      : [],
    years_of_experience: Number(coach.yearsExperience) || 0,
    hourly_rate: coach.hourlyRate,
    languages_spoken: coach.languages
      ? coach.languages.split(",").map((item) => item.trim())
      : [],
    bio: coach.bio,
    profile_photo: coach.profilePhoto,
    availability: coach.availability
      ? coach.availability.split(",").map((item) => item.trim())
      : [],
    status: coach.status as StatusOpt,
    createdAt: coach.createdAt,
  }),
);
