"use client";

import { cn } from "@/lib/utils";
import Label from "@/components/FormElements/common/label";
import { useId, useRef, useState, useEffect } from "react";
import { ChevronUpIcon } from "@/components/IconsCollection/icons";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

type SearchableSelectProps = {
  label: React.ReactNode;
  options: SearchableSelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  filterLocally?: boolean;
  debounceMs?: number;
  disabled?: boolean;
  id?: string;
};

export function SearchableSelect({
  label,
  options,
  placeholder = "Search and select...",
  required,
  error,
  value,
  onChange,
  onBlur,
  onSearch,
  isLoading = false,
  filterLocally = !onSearch,
  debounceMs = 300,
  disabled,
  id: providedId,
}: SearchableSelectProps) {
  const autoId = useId();
  const id = providedId ?? autoId;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const safeValue = value ?? "";
  const selectedOption = options.find((opt) => opt.value === safeValue);
  const displayValue = selectedOption?.label ?? "";

  const filteredOptions = filterLocally
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : options;

  useEffect(() => {
    if (!onSearch || !isOpen) return;

    const timeoutId = window.setTimeout(() => {
      onSearch(searchQuery);
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery, onSearch, debounceMs, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt: SearchableSelectOption) => {
    onChange?.(opt.value);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchQuery(displayValue);
    if (onSearch && !searchQuery.trim()) {
      onSearch("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isOpen) setIsOpen(true);
    if (safeValue) onChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery(displayValue);
    }
  };

  return (
    <div ref={containerRef} className="space-y-3">
      <Label
        as="label"
        htmlFor={id}
        value={label}
        required={Boolean(required)}
      />

      <div className="relative">
        <input
          id={id}
          type="text"
          value={isOpen ? searchQuery : displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={() => {
            onBlur?.();
            setIsOpen(false);
            if (!safeValue) setSearchQuery("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!isOpen && !!safeValue}
          autoComplete="off"
          className={cn(
            "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 pr-12 outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary",
            "text-dark placeholder:text-dark-6 dark:text-white dark:placeholder:text-dark-5",
            error && "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400",
          )}
        />

        <ChevronUpIcon
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180 transition-transform",
            isOpen && "rotate-0",
          )}
        />

        {isOpen && (
          <ul
            className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-stroke bg-white py-1 shadow-lg dark:border-dark-3 dark:bg-dark-2"
            role="listbox"
          >
            {isLoading ? (
              <li className="px-5.5 py-4 text-center text-body-sm text-dark-5 dark:text-dark-6">
                Searching...
              </li>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === safeValue}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                  className={cn(
                    "cursor-pointer px-5.5 py-2.5 text-body-sm text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark-3",
                    opt.value === safeValue && "bg-primary/10 text-primary dark:bg-primary/20",
                  )}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-5.5 py-4 text-center text-body-sm text-dark-5 dark:text-dark-6">
                No matches found
              </li>
            )}
          </ul>
        )}
      </div>

      {error && (
        <p className="mt-1 text-body-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
