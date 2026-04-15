import { supabaseServer } from "@/lib/supabase/server";
import { PersonalCoachFormData } from "@/types/forms";
import { supabaseAdmin } from "@/lib/supabase/client";
import { StatusOpt, SuperAdminCoachesRow } from "@/types/dashboard/super-admin";
import { PersonalCoachRepository } from "./personal-coach.repository";

export async function createPersonalCoachService(form: PersonalCoachFormData) {
  const supabase = await supabaseServer();

  try {
    let logoUrl: string | null = null;
    if (form.profilePhoto) {
      logoUrl = await uploadPersonalCoachProfilePhoto(form.profilePhoto);
    }

    const { data, error } = await supabase.rpc("create_personal_coach", {
      p_first_name: form.firstName,
      p_last_name: form.lastName,
      p_contact_number: form.contactNumber,
      p_email: form.email,
      p_specialization: form.specialization,
      p_coaching_mode: form.coachingMode,
      p_location: form.location,
      p_certifications: form.certifications,
      p_hourly_rate: form.hourlyRate,
      p_years_experience: form.yearsExperience,
      p_languages: form.languages,
      p_bio: form.bio,
      p_profile_photo_url: logoUrl,
      p_availability: form.availability,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadPersonalCoachProfilePhoto(file: File) {
  const extension = file.name.split(".").pop();
  const filePath = `personal-coaches/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from("personal-coaches-assets")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabaseAdmin.storage
    .from("personal-coaches-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
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
