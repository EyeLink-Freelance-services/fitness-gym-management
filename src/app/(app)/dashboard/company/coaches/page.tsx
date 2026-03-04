import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const DUMMY_COACHES = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    clients: 12,
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Lee",
    email: "sarah@example.com",
    clients: 8,
    status: "Active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    clients: 15,
    status: "Active",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    clients: 6,
    status: "On leave",
  },
];

export default function CompanyCoachesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark dark:text-white">
          Coaches
        </h1>
      </div>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Clients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_COACHES.map((coach) => (
              <TableRow key={coach.id}>
                <TableCell className="font-medium">{coach.name}</TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.clients}</TableCell>
                <TableCell>{coach.status}</TableCell>
                <TableCell>
                  <Link
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
