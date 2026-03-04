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

export default function PersonalCoachDashboardPage() {
  const kpis = [
    { label: "Active Clients", value: 12, trend: 2, icon: icons.Users },
    { label: "Sessions This Week", value: 28, trend: 5, icon: icons.Views },
    { label: "Earnings (MTD)", value: "$2,840", trend: 12, icon: icons.Profit },
    { label: "Completion Rate", value: "94%", icon: icons.Product },
  ];

  const todaySessions = [
    { time: "09:00", client: "Alex B.", status: "Done" },
    { time: "11:00", client: "Jane D.", status: "Now" },
    { time: "14:00", client: "Chris L.", status: "Upcoming" },
  ];

  const tomorrowSessions = [
    { time: "10:00", client: "Mike J." },
    { time: "15:00", client: "Sarah K." },
  ];

  const clients = [
    { name: "Alex Brown", goal: "Weight loss", progress: 75 },
    { name: "Jane Doe", goal: "Strength", progress: 60 },
    { name: "Chris Lee", goal: "Endurance", progress: 40 },
  ];

  const announcements = [{ title: "New nutrition workshop", date: "Mar 5" }];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">
        Personal Coach Dashboard
      </h1>

      <DashboardSection title="Overview">
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

      <ChartPlaceholder title="Client progress" className="mb-8" />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection title="Today's sessions">
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaySessions.map((row) => (
                  <TableRow key={`${row.time}-${row.client}`}>
                    <TableCell>{row.time}</TableCell>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                          row.status === "Done"
                            ? "bg-green/20 text-green"
                            : row.status === "Now"
                              ? "bg-primary/20 text-primary"
                              : "bg-dark-3 text-dark-6"
                        }`}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DashboardSection>

        <DashboardSection title="Tomorrow">
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {tomorrowSessions.map((s) => (
              <li
                key={`${s.time}-${s.client}`}
                className="flex justify-between text-sm text-dark dark:text-white"
              >
                <span>{s.time}</span>
                <span className="font-medium">{s.client}</span>
              </li>
            ))}
          </ul>
        </DashboardSection>
      </div>

      <DashboardSection title="Client roster">
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.goal}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-dark-2 dark:bg-dark-3">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="text-sm">{row.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link
                        href="#"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Plan
                      </Link>
                      <Link
                        href="#"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Diet
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardSection>

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
    </div>
  );
}
