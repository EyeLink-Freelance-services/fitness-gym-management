export type MemberStatus = "active" | "inactive";

export type Member = {
  id: string,
  company_id: string,
  assigned_coach_id: string | null,
  member_code: string | null,
  first_name: string,
  last_name: string,
  dob: string,
  gender: string | null,
  phone: string,
  email: string,
  address: string,
  emergency_contact_name: string | null,
  emergency_contact_phone: string,
  medical_notes: string,
  status: MemberStatus
}