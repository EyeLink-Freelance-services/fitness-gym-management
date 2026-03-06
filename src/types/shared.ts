import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui-elements/button";

type TableRowData = Record<string, unknown>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  icon?: ReactNode;
}

export interface TableUIProps {
  className?: string;
  title?: string;
  data: TableRowData[] | Promise<TableRowData[]>;
  buttonLabel?: string;
  buttonPath?: string;
}
