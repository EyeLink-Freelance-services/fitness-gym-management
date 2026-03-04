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

export default function ClientDashboardPage() {
  const kpis = [
    { label: "My Clients", value: 8, icon: icons.Users },
    { label: "Sessions Today", value: 4, trend: 0, icon: icons.Views },
    { label: "Active Plans", value: 8, icon: icons.Product },
    { label: "Completion Rate", value: "91%", icon: icons.Profit },
  ];

  const todaySessions = [
    { time: "09:00", client: "Alex B.", status: "Done" },
    { time: "11:00", client: "Jane D.", status: "Now" },
    { time: "14:00", client: "Chris L.", status: "Upcoming" },
    { time: "16:00", client: "Mike J.", status: "Upcoming" },
  ];

  const upcomingClasses = [
    { name: "HIIT", time: "Tomorrow 10:00" },
    { name: "Yoga", time: "Mar 5 09:00" },
  ];

  const clients = [
    { name: "Alex Brown", progress: 75 },
    { name: "Jane Doe", progress: 60 },
    { name: "Chris Lee", progress: 40 },
  ];

  const medicalNotes = [
    { client: "Chris Lee", note: "Knee injury — avoid jumping" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">
        Coach Dashboard
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

      <ChartPlaceholder title="Multi-client progress" className="mb-8" />

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

        <DashboardSection title="Upcoming class announcements">
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {upcomingClasses.map((c) => (
              <li
                key={c.name}
                className="flex justify-between text-sm text-dark dark:text-white"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-dark-6">{c.time}</span>
              </li>
            ))}
          </ul>
        </DashboardSection>
      </div>

      <DashboardSection title="Client list">
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
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

      <DashboardSection title="Medical notes">
        <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
          {medicalNotes.map((m) => (
            <li key={m.client} className="text-sm">
              <span className="font-medium text-dark dark:text-white">
                {m.client}
              </span>
              <p className="mt-1 text-dark-6">{m.note}</p>
            </li>
          ))}
        </ul>
      </DashboardSection>
    </div>
  );
}
