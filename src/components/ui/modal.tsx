"use client";

import React from "react";
import { createPortal } from "react-dom";
import { CloseButton } from "../ui-elements/close-button";

type Props = {
  open: boolean;
  badge?: string
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({
  open,
  badge,
  title,
  description,
  onClose,
  children,
}: Props) {
  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[28px] border border-stroke/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-dark-3 dark:bg-dark-2/90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />

        <div className="relative border-b border-stroke/70 px-5 py-5 dark:border-dark-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              { badge &&
                <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {badge}
                </div>
              }

              <h3 className="text-lg font-semibold tracking-tight text-dark dark:text-white">
                {title}
              </h3>

              {description && (
                <p className="mt-1 text-sm leading-6 text-dark-5 dark:text-dark-6">
                  {description}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <CloseButton onClick={onClose} />
            </div>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col px-5 py-5 text-dark dark:text-dark-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}