import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui-elements/button";

export type TableRowData = object;
export type StatusTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  icon?: ReactNode;
  toastMessage?: string;
}

export interface TableUIColumn<TData extends TableRowData = TableRowData> {
  key: keyof TData | string;
  label?: string;
  className?: string;
  headClassName?: string;
  cellClassName?: string;
  align?: "left" | "center" | "right";
  render?: (row: TData, rowIndex: number) => ReactNode;
}

export interface TableUIProps<TData extends TableRowData = TableRowData> {
  className?: string;
  title?: string;
  description?: string;
  data: TData[] | Promise<TData[]>;
  buttonLabel?: string;
  buttonPath?: string;
  buttonToast?: string;
  headerActions?: ReactNode;
  columns?: TableUIColumn<TData>[];
  rowKey?: (row: TData, rowIndex: number) => string;
  tableClassName?: string;
  emptyStateLabel?: string;
}
