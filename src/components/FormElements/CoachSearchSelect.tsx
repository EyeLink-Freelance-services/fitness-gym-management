"use client";

import { SearchableSelect } from "@/components/FormElements/SearchableSelect";
import { useCoachSearch } from "@/hooks/use-coach-search";

type CoachSearchSelectProps = {
  label: React.ReactNode;
  value?: string;
  selectedCoachLabel?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  id?: string;
};

export function CoachSearchSelect({
  label,
  value,
  selectedCoachLabel,
  onChange,
  onBlur,
  placeholder = "Search coach by name, email, or phone...",
  required,
  error,
  disabled,
  id,
}: CoachSearchSelectProps) {
  const { options, isLoading, search } = useCoachSearch(
    value,
    selectedCoachLabel,
  );

  return (
    <SearchableSelect
      label={label}
      options={options}
      placeholder={placeholder}
      required={required}
      error={error}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onSearch={search}
      isLoading={isLoading}
      filterLocally={false}
      disabled={disabled}
      id={id}
    />
  );
}
