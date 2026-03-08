import { TableUI } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import type {
  MembershipPromotionRow,
  MembershipPromotionsTableColumn,
  MembershipPromotionsTableProps,
} from "@/types/dashboard/membership";

const columns: MembershipPromotionsTableColumn[] = [
  {
    key: "code",
    label: "Code",
    align: "left",
    headClassName: "min-w-[140px]",
    render: (row: MembershipPromotionRow) => (
      <span className="inline-flex rounded-[10px] bg-[#FEF3C7] px-3 py-2 text-xs font-semibold tracking-[0.18em] text-[#A16207] dark:bg-[#FEF3C7]/10 dark:text-[#FDE68A]">
        {row.code}
      </span>
    ),
  },
  {
    key: "title",
    label: "Offer",
    align: "left",
    headClassName: "min-w-[360px]",
    render: (row: MembershipPromotionRow) => (
      <div className="space-y-1">
        <p className="font-medium text-dark dark:text-white">{row.title}</p>
        <p className="text-sm text-dark-6 dark:text-dark-5">{row.description}</p>
      </div>
    ),
  },
  {
    key: "used",
    label: "Used",
    render: (row: MembershipPromotionRow) => (
      <span className="font-medium text-dark dark:text-white">{row.used}</span>
    ),
  },
  {
    key: "limit",
    label: "Limit",
    render: (row: MembershipPromotionRow) => (
      <span className="text-dark-6 dark:text-dark-5">
        {row.limit === null ? "∞" : row.limit}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row: MembershipPromotionRow) => (
      <StatusBadge label={row.status} tone={row.statusTone} />
    ),
  },
  {
    key: "actionLabel",
    label: "Action",
    align: "right",
    render: (row: MembershipPromotionRow) => (
      <Button
        label={row.actionLabel}
        size="small"
        variant={row.actionVariant}
        toastMessage={row.actionToast}
      />
    ),
  },
];

export function MembershipPromotionsTable({
  rows,
}: MembershipPromotionsTableProps) {
  return (
    <TableUI
      title="Promo Codes & Discounts"
      description="Active promotional campaigns."
      data={rows}
      columns={columns}
      rowKey={(row) => row.code}
      tableClassName="min-w-[900px]"
      headerActions={
        <Button
          label="+ New Promo"
          size="small"
          toastMessage="Promo creation is not connected yet."
        />
      }
    />
  );
}
