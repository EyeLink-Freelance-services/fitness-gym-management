import { Gym, Profit } from "@/components/IconsCollection/icons";
import { getCompanies } from "@/modules/super-admin/super-admin.service";

export async function getOverviewSuperAdminData() {
  const { totalCount } = await getCompanies({ pageSize: 1 });
  const revenue = totalCount * 520;

  return [
    {
      name: "Total Companies",
      value: totalCount || 0,
      growthRate: 0.43,
      icon: Gym,
    },
    {
      name: "Revenue (Rs)",
      value: revenue || 0,
      growthRate: 2.59,
      icon: Profit,
    },
  ];
}
