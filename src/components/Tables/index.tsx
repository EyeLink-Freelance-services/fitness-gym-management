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

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle
            title={title ? title : "List"}
            subtitle={description}
          />
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
                    "whitespace-nowrap text-sm font-medium text-dark dark:text-white",
                    alignmentClasses[alignment].head,
                    column.headClassName,
                    column.className,
                  )}
                >
                  {column.label ?? formatColumnLabel(key)}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

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
                          alignmentClasses[alignment].cell,
                          column.cellClassName,
                          column.className,
                        )}
                      >
                        {column.render(row, rowIndex)}
                      </TableCell>
                    );
                  }

                  if (index === 0) {
                    const logo = toRecord(row).logo;

                    return (
                      <TableCell
                        key={`${key}-${rowIndex}`}
                        className={cn(
                          alignmentClasses[alignment].cell,
                          "font-medium text-dark dark:text-white",
                          column.cellClassName,
                          column.className,
                        )}
                      >
                        <div className="flex min-w-fit items-center gap-3">
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
                          <span>{formatCellValue(key, value)}</span>
                        </div>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={`${key}-${rowIndex}`}
                      className={cn(
                        alignmentClasses[alignment].cell,
                        "text-dark-6 dark:text-dark-6",
                        isNumericColumn(key) &&
                          "font-medium text-dark dark:text-white",
                        column.cellClassName,
                        column.className,
                      )}
                    >
                      {formatCellValue(key, value)}
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
