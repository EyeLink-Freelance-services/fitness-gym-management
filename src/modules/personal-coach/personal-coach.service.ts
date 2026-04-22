import { PersonalCoachFormData } from "@/types/forms";
import { StatusOpt, SuperAdminCoachesRow } from "@/types/dashboard/super-admin";
import {
  PersonalCoach,
  PersonalCoachRepository,
} from "./personal-coach.repository";

export async function createPersonalCoachService(
  form: PersonalCoachFormData,
): Promise<PersonalCoach> {
  try {
    let profilePhotoUrl: string | null = null;

    if (form.profilePhoto) {
      profilePhotoUrl = await uploadPersonalCoachProfilePhoto(
        form.profilePhoto,
      );
    }

    return await PersonalCoachRepository.insert({
      first_name: form.firstName,
      last_name: form.lastName,
      contact_number: form.contactNumber,
      email: form.email,
      specialization: form.specialization,
      coaching_mode: form.coachingMode,
      location: form.location ?? null,
      certifications: form.certifications ?? null,
      hourly_rate: form.hourlyRate,
      years_experience: form.yearsExperience ?? null,
      languages: form.languages,
      bio: form.bio,
      profile_photo_url: profilePhotoUrl,
      availability: form.availability ?? null,
    });
  } catch (error) {
    console.error("createPersonalCoachService failed:", error);
    throw error;
  }
}

export async function uploadPersonalCoachProfilePhoto(file: File) {
  void file;
  throw new Error("Personal coach photo upload is not configured yet.");
}

export async function findAllPersonalCoaches(): Promise<
  SuperAdminCoachesRow[]
> {
  return (await PersonalCoachRepository.findAll()).map(
    (personal_coach): SuperAdminCoachesRow => ({
      id: personal_coach.id,
      first_name: personal_coach.first_name,
      last_name: personal_coach.last_name,
      phone_num: personal_coach.contact_number,
      email: personal_coach.email,
      specialization: personal_coach.specialization,
      coaching_mode: personal_coach.coaching_mode,
      location: personal_coach.location,
      qualifications: personal_coach.qualifications,
      certifications: personal_coach.certifications
        ? personal_coach.certifications.split(",")
        : [],
      years_of_experience: personal_coach.years_experience,
      hourly_rate: personal_coach.hourly_rate,
      languages_spoken: personal_coach.languages
        ? personal_coach.languages.split(",")
        : [],
      bio: personal_coach.bio,
      profile_photo: personal_coach.profile_photo_url,
      availability: personal_coach.availability,
      status: personal_coach.deleted_at
        ? ("inactive" as StatusOpt)
        : ("active" as StatusOpt),
      createdAt: personal_coach.created_at,
    }),
  );
}

export async function getLastFivePersonalCoaches(): Promise<
  SuperAdminCoachesRow[]
> {
  const personalCoaches = await PersonalCoachRepository.findSummary(1, 5);

  return personalCoaches.map(
    (personal_coach: any): SuperAdminCoachesRow => ({
      id: personal_coach.id,
      first_name: personal_coach.first_name,
      last_name: personal_coach.last_name,
      phone_num: personal_coach.contact_number,
      email: personal_coach.email,
      specialization: personal_coach.specialization,
      coaching_mode: personal_coach.coaching_mode,
      location: personal_coach.location,
      qualifications: personal_coach.qualifications,
      certifications: personal_coach.certifications
        ? personal_coach.certifications.split(",")
        : [],
      years_of_experience: personal_coach.years_experience,
      hourly_rate: personal_coach.hourly_rate,
      languages_spoken: personal_coach.languages
        ? personal_coach.languages.split(",")
        : [],
      bio: personal_coach.bio,
      profile_photo: personal_coach.profile_photo_url,
      availability: personal_coach.availability,
      status: personal_coach.deleted_at
        ? ("inactive" as StatusOpt)
        : ("active" as StatusOpt),
      createdAt: personal_coach.created_at,
    }),
  );
}
