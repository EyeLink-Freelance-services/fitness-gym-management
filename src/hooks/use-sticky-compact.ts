"use client";

import { useEffect, useRef, useState } from "react";

export function useStickyCompact(options?: {
  rootMargin?: string;
  threshold?: number;
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCompact(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: options?.threshold ?? 0,
        rootMargin: options?.rootMargin ?? "0px 0px 0px 0px",
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold]);

  return { sentinelRef, isCompact };
}