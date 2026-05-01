import {
  Gym,
  Profit,
  Trainer,
  Users,
} from "@/components/IconsCollection/icons";
import { getCompanies } from "@/modules/company/company.service";

export async function getOverviewSuperAdminData() {
  const { totalCount } = await getCompanies({ pageSize: 1 });
  const revenue = totalCount * 520;

  return [
    {
      name: "Total Users",
      value: totalCount || 0,
      growthRate: -0.95,
      icon: Users,
    },
    {
      name: "Total Companies",
      value: totalCount || 0,
      growthRate: 0.43,
      icon: Gym,
    },
    {
      name: "Total Coaches",
      value: 0,
      growthRate: 4.35,
      icon: Trainer,
    },
    {
      name: "Revenue",
      value: revenue || 0,
      growthRate: 2.59,
      icon: Profit,
    },
  ];
}
