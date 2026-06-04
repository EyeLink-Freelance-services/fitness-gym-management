import { useState, useCallback, useMemo, useEffect } from "react";

interface FetchResponse<T> {
  data: T[];
  totalCount: number;
}

export function usePagination<T>({
  initialData,
  initialTotalCount,
  pageSize = 10,
  fetchFn,
}: {
  initialData: T[];
  initialTotalCount: number;
  pageSize?: number;
  fetchFn: (pageNumber: number, pageSize: number) => Promise<FetchResponse<T>>;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState<T[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTotalCount(initialTotalCount);
  }, [initialTotalCount]);

  useEffect(() => {
    if (pageIndex === 0) {
      setData(initialData);
    }
  }, [initialData, pageIndex]);

  const totalPages = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize],
  );

  const goToPage = useCallback(
    async (newPageIndex: number) => {
      if (newPageIndex < 0 || newPageIndex >= totalPages) return;

      setIsLoading(true);
      try {
        const response = await fetchFn(newPageIndex, pageSize);
        setData(response.data);
        setTotalCount(response.totalCount);
        setPageIndex(newPageIndex);
      } catch (error) {
        console.error("Failed to fetch paginated data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize, totalPages, fetchFn],
  );

  const nextPage = useCallback(() => {
    if (pageIndex < totalPages - 1) {
      goToPage(pageIndex + 1);
    }
  }, [pageIndex, totalPages, goToPage]);

  const previousPage = useCallback(() => {
    if (pageIndex > 0) {
      goToPage(pageIndex - 1);
    }
  }, [pageIndex, goToPage]);

  const refetchCurrentPage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchFn(pageIndex, pageSize);
      setData(response.data);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Failed to refetch paginated data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, pageIndex, pageSize]);

  const canGoNext = pageIndex < totalPages - 1;
  const canGoPrevious = pageIndex > 0;

  return {
    data,
    isLoading,
    currentPage: pageIndex,
    pageSize,
    totalCount,
    totalPages,
    canGoNext,
    canGoPrevious,
    goToPage,
    nextPage,
    previousPage,
    refetchCurrentPage,
  };
}
