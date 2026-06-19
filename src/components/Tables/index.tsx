import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui-elements/button";
import {
  formatCellValue,
  formatColumnLabel,
  isImageSrc,
} from "@/lib/formatters/format-table";
import type { TableRowData, TableUIColumn, TableUIProps } from "@/types/shared";
import CardTitle from "../Dashboard/overview-cards/cardTitle";

const alignmentClasses = {
  left: {
    head: "!text-left",
    cell: "!text-left",
  },
  center: {
    head: "!text-center",
    cell: "!text-center",
  },
  right: {
    head: "!text-right",
    cell: "!text-right",
  },
} as const;

export async function TableUI<TData extends TableRowData = TableRowData>({
  className,
  title,
  description,
  data,
  buttonLabel,
  buttonPath,
  buttonToast,
  headerActions,
  columns,
  rowKey,
  tableClassName,
  emptyStateLabel,
}: TableUIProps<TData>) {
  const rows = await data;
  const toRecord = (row: TData | TableRowData) =>
    row as Record<string, unknown>;
  const allKeys = Array.from(
    new Set(rows.flatMap((row) => Object.keys(toRecord(row)))),
  );
  const firstRowKeys = Object.keys(toRecord((rows[0] ?? {}) as TData));
  const remainingKeys = allKeys.filter((key) => !firstRowKeys.includes(key));
  const fallbackOrderedKeys = [...firstRowKeys, ...remainingKeys].filter(
    (key) => key !== "logo" && key !== "id",
  );
  const resolvedColumns: TableUIColumn<TData>[] =
    columns && columns.length > 0
      ? columns
      : fallbackOrderedKeys.map((key, index) => ({
          key,
          label: formatColumnLabel(key),
          align:
            index === 0
              ? "left"
              : rows.every(
                    (row) =>
                      toRecord(row)[key] == null ||
                      typeof toRecord(row)[key] === "number",
                  )
                ? "right"
                : "center",
        }));

  const hasRows = rows.length > 0 && resolvedColumns.length > 0;

  const isNumericColumn = (key: string) =>
    rows.every(
      (row) =>
        toRecord(row)[key] == null || typeof toRecord(row)[key] === "number",
    );

  const toDisplayText = (value: unknown) => {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return "";
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle title={title ? title : "List"} subtitle={description} />
        </div>

        <div className="flex flex-wrap gap-3">
          {headerActions}
          {buttonLabel && buttonPath && (
            <Link href={buttonPath}>
              <Button label={buttonLabel} toastMessage={buttonToast} />
            </Link>
          )}
        </div>
      </div>

      <Table className={cn("w-full", tableClassName)}>
        {hasRows && (
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2">
              {resolvedColumns.map((column, index) => {
                const key = String(column.key);
                const alignment =
                  column.align ??
                  (index === 0
                    ? "left"
                    : isNumericColumn(key)
                      ? "right"
                      : "center");

                return (
                  <TableHead
                    key={key}
                    className={cn(
                      "overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-dark dark:text-white",
                      alignmentClasses[alignment].head,
                      column.headClassName,
                      column.className,
                    )}
                  >
                    <span className="block truncate">
                      {column.label ?? formatColumnLabel(key)}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
        )}

        <TableBody>
          {!hasRows ? (
            <TableRow>
              <TableCell
                colSpan={Math.max(resolvedColumns.length, 1)}
                className="text-center text-base text-dark dark:text-white"
              >
                {emptyStateLabel ?? "No data available"}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow
                className="text-base text-dark dark:text-white"
                key={
                  rowKey?.(row, rowIndex) ??
                  `${String(toRecord(row).name ?? "row")}-${rowIndex}`
                }
              >
                {resolvedColumns.map((column, index) => {
                  const key = String(column.key);
                  const value = toRecord(row)[key];
                  const alignment =
                    column.align ??
                    (index === 0
                      ? "left"
                      : isNumericColumn(key)
                        ? "right"
                        : "center");

                  if (column.render) {
                    return (
                      <TableCell
                        key={`${key}-${rowIndex}`}
                        className={cn(
                          "overflow-hidden",
                          alignmentClasses[alignment].cell,
                          column.headClassName,
                          column.cellClassName,
                          column.className,
                        )}
                      >
                        <div className="w-full truncate">
                          {column.render(row, rowIndex)}
                        </div>
                      </TableCell>
                    );
                  }

                  if (index === 0) {
                    const logo = toRecord(row).logo;

                    return (
                      <TableCell
                        key={`${key}-${rowIndex}`}
                        className={cn(
                          "overflow-hidden",
                          alignmentClasses[alignment].cell,
                          "font-medium text-dark dark:text-white",
                          column.headClassName,
                          column.cellClassName,
                          column.className,
                        )}
                      >
                        <div className="flex w-full min-w-0 items-center gap-3">
                          {isImageSrc(logo) && (
                            <Image
                              src={logo}
                              className="size-8 rounded-full object-cover"
                              width={40}
                              height={40}
                              alt={`${String(value ?? "Item")} Logo`}
                              role="presentation"
                            />
                          )}
                          <span
                            className="block flex-1 truncate"
                            title={toDisplayText(value)}
                          >
                            {formatCellValue(key, value)}
                          </span>
                        </div>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={`${key}-${rowIndex}`}
                      className={cn(
                        "overflow-hidden",
                        alignmentClasses[alignment].cell,
                        "text-dark-6 dark:text-dark-6",
                        isNumericColumn(key) &&
                          "font-medium text-dark dark:text-white",
                        column.headClassName,
                        column.cellClassName,
                        column.className,
                      )}
                    >
                      <span
                        className="block w-full truncate"
                        title={toDisplayText(value)}
                      >
                        {formatCellValue(key, value)}
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export { DataTable } from "./data-table";
