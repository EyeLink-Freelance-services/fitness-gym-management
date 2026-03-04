import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { ChartPlaceholder } from "@/components/Dashboard/chart-placeholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as icons from "@/components/IconsCollection/icons";
import Link from "next/link";

export default function CompanyDashboardPage() {
  const kpis = [
    { label: "Total Members", value: "1,240", trend: 3, icon: icons.Users },
    { label: "Active", value: "892", trend: 1, icon: icons.Views },
    { label: "Expiring (30d)", value: "48", trend: -2, icon: icons.Product },
    { label: "Pending Payments", value: "12", icon: icons.Profit },
    { label: "Revenue", value: "$42,100", trend: 8, icon: icons.Profit },
    { label: "Expenses", value: "$18,200", trend: -1, icon: icons.Product },
    { label: "New Signups", value: "34", trend: 5, icon: icons.Users },
    { label: "Staff", value: "24", icon: icons.Users },
  ];

  const expiringMemberships = [
    { name: "Alex Brown", plan: "Premium", expires: "Mar 10" },
    { name: "Jane Doe", plan: "Basic", expires: "Mar 12" },
  ];

  const coachAssignments = [
    { client: "Alex Brown", coach: "John Smith", status: "Assigned" },
    { client: "New User", coach: "—", status: "Pending" },
  ];

  const announcements = [
    { title: "Holiday hours", date: "Mar 1" },
    { title: "New class: HIIT", date: "Mar 2" },
  ];

  const medicalAlerts = [
    { name: "Chris Lee", note: "Knee injury — low impact only" },
  ];
  const pendingCoach = [{ name: "New User", joined: "Mar 2" }];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">
        Company Dashboard
      </h1>

      <DashboardSection title="KPIs">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* {kpis.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              icon={kpi.icon}
            />
          ))} */}
        </div>
      </DashboardSection>

      <ChartPlaceholder title="Revenue vs Expenses" className="mb-8" />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection title="Expiring memberships">
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringMemberships.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.plan}</TableCell>
                    <TableCell>{row.expires}</TableCell>
                    <TableCell>
                      <Link
                        href="#"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Renew
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DashboardSection>

        <DashboardSection title="Coach → Client assignment">
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Coach</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coachAssignments.map((row) => (
                  <TableRow key={row.client}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell>{row.coach}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DashboardSection>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DashboardSection title="Announcements">
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {announcements.map((a) => (
              <li key={a.title} className="text-sm text-dark dark:text-white">
                <span className="font-medium">{a.title}</span>
                <span className="ml-2 text-dark-6">{a.date}</span>
              </li>
            ))}
          </ul>
        </DashboardSection>
        <DashboardSection title="Medical alerts">
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {medicalAlerts.map((m) => (
              <li key={m.name} className="text-sm">
                <span className="font-medium text-dark dark:text-white">
                  {m.name}
                </span>
                <p className="mt-1 text-dark-6">{m.note}</p>
              </li>
            ))}
          </ul>
        </DashboardSection>
        <DashboardSection title="New signups — pending coach">
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {pendingCoach.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium text-dark dark:text-white">
                  {p.name}
                </span>
                <span className="text-dark-6">{p.joined}</span>
              </li>
            ))}
          </ul>
        </DashboardSection>
      </div>
    </div>
  );
}
