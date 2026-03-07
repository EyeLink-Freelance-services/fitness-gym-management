import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const DUMMY_MEMBERS = [
  { id: "1", name: "Alex Brown", plan: "Premium", status: "Active" },
  { id: "2", name: "Jane Doe", plan: "Basic", status: "Active" },
  { id: "3", name: "Chris Lee", plan: "Premium", status: "Expiring" },
];

export default function CompanyMembersPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark dark:text-white">
          Members
        </h1>
      </div>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_MEMBERS.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.plan}</TableCell>
                <TableCell>{member.status}</TableCell>
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
