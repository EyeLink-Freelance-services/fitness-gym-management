import { useState, useCallback, useMemo, useEffect, useRef } from "react";

interface FetchResponse<T> {
  data: T[];
  totalCount: number;
}

type FetchFn<T> = (
  pageNumber: number,
  pageSize: number,
  search: string,
) => Promise<FetchResponse<T>>;

export function usePagination<T>({
  initialData,
  initialTotalCount,
  pageSize = 10,
  fetchFn,
  searchDebounceMs = 300,
}: {
  initialData: T[];
  initialTotalCount: number;
  pageSize?: number;
  fetchFn: FetchFn<T>;
  searchDebounceMs?: number;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState<T[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [prevInitialTotalCount, setPrevInitialTotalCount] =
    useState(initialTotalCount);

  const fetchFnRef = useRef(fetchFn);
  const pageSizeRef = useRef(pageSize);
  const searchRef = useRef(search);
  const pageIndexRef = useRef(pageIndex);
  const isFirstSearchEffect = useRef(true);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    pageIndexRef.current = pageIndex;
  }, [pageIndex]);

  const activeSearch = search.trim();

  if (!Object.is(initialTotalCount, prevInitialTotalCount)) {
    setPrevInitialTotalCount(initialTotalCount);
    if (!activeSearch) {
      setTotalCount(initialTotalCount);
    }
  }

  if (!Object.is(initialData, prevInitialData)) {
    setPrevInitialData(initialData);
    if (pageIndex === 0 && !activeSearch) {
      setData(initialData);
    }
  }

  const totalPages = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize],
  );

  const fetchPage = useCallback(async (newPageIndex: number, searchQuery: string) => {
    if (newPageIndex < 0) return;

    setIsLoading(true);
    try {
      const response = await fetchFnRef.current(
        newPageIndex,
        pageSizeRef.current,
        searchQuery,
      );
      setData(response.data);
      setTotalCount(response.totalCount);
      setPageIndex(newPageIndex);
    } catch (error) {
      console.error("Failed to fetch paginated data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Only refetch when the search text changes — not when fetchFn identity changes.
  useEffect(() => {
    if (isFirstSearchEffect.current) {
      isFirstSearchEffect.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void fetchPage(0, search.trim());
    }, searchDebounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [search, searchDebounceMs, fetchPage]);

  const goToPage = useCallback(
    async (newPageIndex: number) => {
      if (newPageIndex < 0) return;
      if (totalPages > 0 && newPageIndex >= totalPages) return;

      await fetchPage(newPageIndex, searchRef.current.trim());
    },
    [totalPages, fetchPage],
  );

  const nextPage = useCallback(() => {
    if (pageIndex < totalPages - 1) {
      void goToPage(pageIndex + 1);
    }
  }, [pageIndex, totalPages, goToPage]);

  const previousPage = useCallback(() => {
    if (pageIndex > 0) {
      void goToPage(pageIndex - 1);
    }
  }, [pageIndex, goToPage]);

  const refetchCurrentPage = useCallback(async () => {
    await fetchPage(pageIndexRef.current, searchRef.current.trim());
  }, [fetchPage]);

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
    search,
    setSearch,
    goToPage,
    nextPage,
    previousPage,
    refetchCurrentPage,
  };
}
