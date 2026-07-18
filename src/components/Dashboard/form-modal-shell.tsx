"use client";

import { CloseButton } from "@/components/ui-elements/close-button";
import type { ReactNode } from "react";

type FormModalShellProps = {
  onClose: () => void;
  children: ReactNode;
};

export function FormModalShell({ onClose, children }: FormModalShellProps) {
  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
      <CloseButton
        size="small"
        variant="ghost"
        className="absolute right-3 top-3 z-10 md:hidden"
        onClick={onClose}
      />
      <div className="max-h-[85vh] overflow-y-auto p-4">{children}</div>
    </div>
  );
}
