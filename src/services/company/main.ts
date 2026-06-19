import {
  Gym,
  Profit,
  Trainer,
  Users,
} from "@/components/IconsCollection/icons";
import {
  getCompanyClients,
  getCompanyCoaches,
} from "@/services/company/company.service";

export async function getOverviewCompanyData() {
  const [clientsResult, coachesResult] = await Promise.all([
    getCompanyClients({ pageSize: 1 }),
    getCompanyCoaches({ pageSize: 1 }),
  ]);


  const clientCount = clientsResult.totalCount;
  const coachCount = coachesResult.totalCount;
  const revenue = clientCount * 520;

  return [
    // {
    //   name: "Total Staff",
    //   value: clientCount || 0,
    //   growthRate: -0.95,
    //   icon: Users,
    // },
    {
      name: "Total Coaches",
      value: coachCount || 0,
      growthRate: 0.43,
      icon: Gym,
    },
    {
      name: "Total Clients",
      value: clientCount || 0,
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