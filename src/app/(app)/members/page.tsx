import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants/route";
import { listMembers } from "@/lib/db/queries/members";
import Link from "next/link";

export default async function MembersPage() {
 const members = await listMembers();

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-center justify-between py-6 pr-5">
        <h2 className="panel-title text-[40px] px-4 py-6 text-dark dark:text-white md:px-6 xl:px-9">
          Members
        </h2>
        <Link
          href={ROUTES.MEMBERS.NEW_MEMBER}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          + New Member
        </Link>

      </div>

      {members.length === 0 
        ? (
          <p>No members yet.</p>
        ) : (
        
          <Table>
            <TableHeader>
              <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
                <TableHead className="min-w-[120px]">Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
    
            <TableBody>
              {members.map((m: any, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Link href={`/members/${m.id}`}>{m.first_name} {m.last_name}</Link>
                  </TableCell>
                  <TableCell>
                    {m.gender}
                  </TableCell>
                  <TableCell>
                    {m.email}
                  </TableCell>
                  <TableCell>
                    {m.phone}
                  </TableCell>
                  <TableCell>
                    {m.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      }
    </div>
  );
}
