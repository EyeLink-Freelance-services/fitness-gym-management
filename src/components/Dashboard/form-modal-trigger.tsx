"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import CompanyForm from "@/components/Forms/CompanyForm";
import PersonalCoachForm from "@/components/Forms/PersonalCoachForm";
import { Button } from "@/components/ui-elements/button";

type FormType = "company" | "personal";

type FormModalTriggerProps = {
  buttonLabel: string;
  formType: FormType;
};

export function FormModalTrigger({ buttonLabel, formType }: FormModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  const close = () => setIsOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <Button type="button" label={buttonLabel} onClick={() => setIsOpen(true)} />

      {isOpen &&
        (mounted
          ? createPortal(
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) close();
                }}
              >
                <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
                  <div className="max-h-[85vh] overflow-y-auto p-4">
                    {formType === "company" && <CompanyForm />}
                    {formType === "personal" && <PersonalCoachForm />}
                  </div>
                </div>
              </div>,
              document.body,
            )
          : null)}
    </>
  );
}
