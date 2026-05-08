import {
  Gym,
  Profit,
  Trainer,
  Users,
} from "@/components/IconsCollection/icons";
import { getCompanyClientsForCompany } from "@/modules/company/company.service";

export async function getOverviewCompanyData() {
  const { totalCount } = await getCompanyClientsForCompany({ pageSize: 1 });
  const revenue = totalCount * 520;

  return [
    {
      name: "Total Staff",
      value: totalCount || 0,
      growthRate: -0.95,
      icon: Users,
    },
    {
      name: "Total Coaches",
      value: totalCount || 0,
      growthRate: 0.43,
      icon: Gym,
    },
    {
      name: "Total Clients",
      value: totalCount ||0,
      growthRate: 4.35,
      icon: Trainer,
    },
    {
      name: "Revenue (Rs)",
      value: revenue || 0,
      growthRate: 2.59,
      icon: Profit,
    },
  ];
}