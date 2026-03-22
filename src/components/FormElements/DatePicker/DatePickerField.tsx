"use client";

import { Calendar } from "@/components/IconsCollection/icons";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useEffect, useRef } from "react";

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  minDate?: string;
  disabled?: boolean;
};

export default function DatePickerField({
  label,
  placeholder = "Select date",
  value,
  onChange,
  minDate,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const instance = flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      minDate,
      defaultDate: value || undefined,
      onChange: (selectedDates, dateStr) => {
        onChange?.(dateStr);
      },
    });

    return () => {
      instance.destroy();
    };
  }, [onChange, value]);

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          defaultValue={value}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full rounded-[14px] border-[1.5px] border-stroke bg-transparent px-4 py-3 pr-11 text-sm font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
}