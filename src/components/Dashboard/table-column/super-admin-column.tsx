import {
  SuperAdminCompanyRow,
} from "@/types/dashboard/super-admin";
import type { TableUIColumn } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";

export const superAdminCompanyColumns: ColumnDef<SuperAdminCompanyRow>[] = [
  {
    accessorKey: "company_name",
    header: "Company Name",
    meta: { align: "left", headClassName: "min-w-[180px]" },
  },
  {
    accessorKey: "email",
    header: "Company Email",
    meta: { align: "left", headClassName: "min-w-[220px]" },
  },
  {
    accessorKey: "business_reg_no",
    header: "BRN",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "contact_number",
    header: "Contact",
    meta: { align: "left", headClassName: "min-w-[150px]" },
  },
  {
    accessorKey: "address_line_1",
    header: "Address",
    cell: ({ row }) => (
      <span>
        {row.original.address_line_1}, {row.original.city}
      </span>
    ),
    meta: { align: "left", headClassName: "min-w-[220px]" },
  },
  {
    accessorKey: "standard_price",
    header: "Standard Price",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
];

export const superAdminCompanyPreviewColumns: TableUIColumn<SuperAdminCompanyRow>[] =
  [
    {
      key: "company_name",
      label: "Name",
      align: "left",
      render: (row) => `${row.company_name}`,
      headClassName: "min-w-[140px] max-w-[150px]",
    },
    {
      key: "contact_num",
      label: "Phone",
      align: "left",
      render: (row) => row.contact_number,
      headClassName: "min-w-[140px]",
    },
    {
      key: "brn",
      label: "BRN",
      align: "left",
      render: (row) => row.business_reg_no,
      headClassName: "min-w-[140px] max-w-[150px]",
    },
    {
      key: "address",
      label: "Address",
      align: "left",
      render: (row) => `${row.district}, ${row.city}`,
      headClassName: "min-w-[180px] max-w-[190px]",
    },
  ];
