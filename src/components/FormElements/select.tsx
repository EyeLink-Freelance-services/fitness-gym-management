"use client";

import { ChevronUpIcon } from "@/components/IconsCollection/icons";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";
import Label from "@/components/FormElements/common/label";

type PropsType = {
  label: React.ReactNode;
  items: { value: string; label: string }[];
  prefixIcon?: React.ReactNode;
  className?: string;
  selectProps?: React.ComponentPropsWithRef<"select">;
  error?: string;
  id?: string;
} & (
  | { placeholder?: string; defaultValue: string }
  | { placeholder: string; defaultValue?: string }
);

export function Select({
  items,
  label,
  defaultValue,
  placeholder,
  prefixIcon,
  className,
  selectProps,
  error,
  id: providedId,
}: PropsType) {
  const { className: selectClassName, onChange, ...restSelectProps } = selectProps ?? {};
  const autoId = useId();
  const id = providedId ?? restSelectProps.id ?? autoId;
  const isRequired = restSelectProps.required;
  const defaultFormValue = (restSelectProps.defaultValue ?? defaultValue) || "";

  const [isOptionSelected, setIsOptionSelected] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      <Label
        as="label"
        htmlFor={id}
        value={label}
        required={Boolean(isRequired)}
      />

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {prefixIcon}
          </div>
        )}

        <select
          id={id}
          defaultValue={defaultFormValue}
          onChange={(e) => {
            setIsOptionSelected(true);
            onChange?.(e);
          }}
          className={cn(
            "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6",
            isOptionSelected && "text-dark dark:text-white",
            prefixIcon && "pl-11.5",
            error && "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400",
            selectClassName,
          )}
          {...restSelectProps}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
      </div>

      {error && <p className="text-body-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
