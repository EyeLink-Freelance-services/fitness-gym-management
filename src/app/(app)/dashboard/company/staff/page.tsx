import { CompanyStaffTableClient } from "@/components/Dashboard/company/company-staff-table-client";
import { getCompanyStaff } from "@/services/dashboard.services";

export default async function CompanyStaffPage() {
  const staff = await getCompanyStaff();

  return <CompanyStaffTableClient data={staff} />;
}
