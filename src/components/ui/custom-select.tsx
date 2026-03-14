"use client";

import { ChevronDown } from "../IconsCollection/icons";

type Option = {
  label: string;
  value: string | number;
};

type CustomSelectProps = {
  options: Option[];
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
};

const CustomSelect = ({
  options,
  defaultValue,
  onChange,
  className,
  placeholder = "Select an option",
}: CustomSelectProps) => {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-11 w-full appearance-none rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
      >
        <option value="" disabled hidden className="dark:text-green">
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:text-dark">
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark dark:text-white" />
    </div>
  );
};

export default CustomSelect;
