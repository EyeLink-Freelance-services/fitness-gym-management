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
import { TableUIProps } from "@/types/shared";

export async function TableUI({
  className,
  title,
  data,
  buttonLabel,
  buttonPath,
}: TableUIProps) {
  const rows = await data;
  const allKeys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const firstRowKeys = Object.keys(rows[0] ?? {});
  const remainingKeys = allKeys.filter((key) => !firstRowKeys.includes(key));
  const orderedKeys = [...firstRowKeys, ...remainingKeys].filter(
    (key) => key !== "logo" && key !== "id",
  );

  const hasRows = rows.length > 0 && orderedKeys.length > 0;

  const isNumericColumn = (key: string) =>
    rows.every((row) => row[key] == null || typeof row[key] === "number");

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          {title ? title : "Top Channels "}
        </h2>
        {buttonLabel && buttonPath && (
          <Link href={buttonPath}>
            <Button label={buttonLabel} />
          </Link>
        )}
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            {orderedKeys.map((key, index) => (
              <TableHead
                key={key}
                className={cn(
                  index === 0 && "!text-left",
                  isNumericColumn(key) && index !== 0 && "!text-right",
                )}
              >
                {formatColumnLabel(key)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {!hasRows ? (
            <TableRow>
              <TableCell className="text-center text-base text-dark dark:text-white">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={`${String(row.name ?? "row")}-${rowIndex}`}
              >
                {orderedKeys.map((key, index) => {
                  const value = row[key];

                  if (index === 0) {
                    const logo = row.logo;

                    return (
                      <TableCell
                        key={`${key}-${rowIndex}`}
                        className="!text-left"
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
                      className={cn(isNumericColumn(key) && "!text-right")}
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
