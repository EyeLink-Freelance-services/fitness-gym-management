"use client";

import { Button } from "@/components/ui-elements/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DataTableColumnMeta, DataTableProps } from "@/types/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

const alignmentClasses: Record<
  NonNullable<DataTableColumnMeta["align"]>,
  { head: string; cell: string }
> = {
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
};

const inputClasses =
  "h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none placeholder:text-dark-5 focus:border-primary dark:border-dark-3 dark:text-white dark:placeholder:text-dark-5";

export function DataTable<TData extends RowData>({
  title,
  description,
  data,
  columns,
  headerActions,
  toolbar,
  className,
  tableClassName,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  emptyStateLabel,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20],
  showFooter = true,
  getRowId,
  onRowClick,
  isLoading = false,
}: DataTableProps<TData>) {
  const isServerSearch = typeof onSearchChange === "function";
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const searchInputValue = isServerSearch
    ? (searchValue ?? "")
    : globalFilter;

  const handleSearchChange = (value: string) => {
    if (isServerSearch) {
      onSearchChange(value);
      return;
    }
    setGlobalFilter(value);
  };

  // TanStack Table returns unstable function refs by design; not memoization-safe.
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable API
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: isServerSearch ? "" : globalFilter,
      pagination,
    },
    onGlobalFilterChange: isServerSearch ? undefined : setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    manualFiltering: isServerSearch,
    getRowId,
  });

  useEffect(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    );
  }, [data, globalFilter, searchValue]);

  const rows = table.getRowModel().rows;
  const filteredRowCount = isServerSearch
    ? data.length
    : table.getFilteredRowModel().rows.length;
  const hasRows = rows.length > 0;
  const hasToolbar = Boolean(searchPlaceholder || toolbar);

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            {title ?? "Data Table"}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          {headerActions && (
            <div className="flex flex-wrap gap-3">{headerActions}</div>
          )}

          {hasToolbar && (
            <div>
              {searchPlaceholder ? (
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(inputClasses, "w-full xl:max-w-sm")}
                />
              ) : (
                <div />
              )}

              {toolbar && <div className="w-full xl:w-auto">{toolbar}</div>}
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[10px] bg-white/70 dark:bg-gray-dark/70"
            aria-busy="true"
            aria-live="polite"
          >
            <span
              className="inline-block size-8 animate-spin rounded-full border-2 border-primary border-r-transparent"
              aria-hidden
            />
            <span className="sr-only">Loading</span>
          </div>
        )}
        <Table
          className={cn("w-full", tableClassName, isLoading && "opacity-60")}
        >
          <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-none bg-[#F7F9FC] dark:bg-dark-2"
            >
              {headerGroup.headers.map((header) => {
                const meta = (header.column.columnDef.meta ??
                  {}) as DataTableColumnMeta;
                const align = meta.align ?? "center";

                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "whitespace-nowrap text-sm font-medium text-dark dark:text-white",
                      alignmentClasses[align].head,
                      meta.headClassName,
                      meta.className,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {!hasRows ? (
            <TableRow>
              <TableCell
                colSpan={Math.max(columns.length, 1)}
                className="text-center text-base text-dark dark:text-white"
              >
                {emptyStateLabel ?? "No data available"}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  "text-base text-dark dark:text-white",
                  onRowClick && "cursor-pointer",
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = (cell.column.columnDef.meta ??
                    {}) as DataTableColumnMeta;
                  const align = meta.align ?? "center";

                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        alignmentClasses[align].cell,
                        meta.cellClassName,
                        meta.className,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
        </Table>
      </div>

      {showFooter && (
        <div className="mt-5 flex flex-col gap-3 border-t border-stroke pt-4 text-sm dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="shrink-0 whitespace-nowrap text-dark-6 dark:text-dark-6">
            Showing {rows.length} of {filteredRowCount} result
            {filteredRowCount === 1 ? "" : "s"}
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <label className="flex shrink-0 items-center gap-2 text-dark-6 dark:text-dark-6">
              <span>Rows</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(event) =>
                  table.setPageSize(Number(event.target.value))
                }
                className={cn(inputClasses, "h-10 min-w-[84px] px-3 py-0")}
              >
                {pageSizeOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="dark:bg-[#122031] dark:text-white"
                  >
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <span className="shrink-0 whitespace-nowrap text-dark-6 dark:text-dark-6">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.max(table.getPageCount(), 1)}
            </span>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                label="Previous"
                size="small"
                variant="outlineDark"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={cn(
                  !table.getCanPreviousPage() &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent dark:hover:bg-transparent",
                )}
              />
              <Button
                type="button"
                label="Next"
                size="small"
                variant="outlineDark"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={cn(
                  !table.getCanNextPage() &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent dark:hover:bg-transparent",
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
