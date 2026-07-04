"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { searchCompanyCoachOptions } from "@/app/(app)/dashboard/company/coaches/actions";
import type { AssignCoachOption } from "@/types/dashboard/assign-client";

function mergeSelectedCoachOption(
  options: AssignCoachOption[],
  selectedCoachId?: string,
  selectedCoachLabel?: string,
): AssignCoachOption[] {
  if (!selectedCoachId) return options;
  if (options.some((option) => option.value === selectedCoachId)) {
    return options;
  }

  return [
    {
      value: selectedCoachId,
      label: selectedCoachLabel ?? selectedCoachId,
    },
    ...options,
  ];
}

export function useCoachSearch(
  selectedCoachId?: string,
  selectedCoachLabel?: string,
) {
  const [options, setOptions] = useState<AssignCoachOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const results = await searchCompanyCoachOptions(query);
      setOptions(Array.isArray(results) ? results : []);
    } catch {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void search("");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [search]);

  const displayOptions = useMemo(
    () =>
      mergeSelectedCoachOption(
        options,
        selectedCoachId,
        selectedCoachLabel,
      ),
    [options, selectedCoachId, selectedCoachLabel],
  );

  return {
    options: displayOptions,
    isLoading,
    search,
  };
}
