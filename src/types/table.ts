import type { ReactNode } from "react";
import type { ColumnDef, RowData } from "@tanstack/react-table";

export type ColumnAlignment = "left" | "center" | "right";

export interface DataTableColumnMeta {
  align?: ColumnAlignment;
  className?: string;
  headClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<TData extends RowData> {
  title?: string;
  description?: string;
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  headerActions?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
  tableClassName?: string;
  searchPlaceholder?: string;
  emptyStateLabel?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  showFooter?: boolean;
  getRowId?: (originalRow: TData, index: number) => string;
}
