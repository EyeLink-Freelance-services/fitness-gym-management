"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui-elements/button";
import ClientForm from "@/components/Forms/ClientForm";
import CompanyForm from "@/components/Forms/CompanyForm";
import PersonalCoachForm from "@/components/Forms/PersonalCoachForm";
import StaffCoachForm from "@/components/Forms/StaffCoachForm";
import { FormModalId } from "@/types/forms";

export function FormsTesting() {
  const [active, setActive] = useState<FormModalId | null>(null);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  const close = () => setActive(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  return (
    <>
      <div className="z-99 my-4 rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2 md:my-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-dark dark:text-white">
              forms
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-4">
            <Button
              type="button"
              label="Client"
              variant="outlineDark"
              size="small"
              onClick={() => setActive("client")}
            />
            <Button
              type="button"
              label="Company"
              variant="outlineDark"
              size="small"
              onClick={() => setActive("company")}
            />
            <Button
              type="button"
              label="Personal Coach"
              variant="outlineDark"
              size="small"
              onClick={() => setActive("personal")}
            />
            <Button
              type="button"
              label="Staff Coach"
              variant="outlineDark"
              size="small"
              onClick={() => setActive("staff")}
            />
          </div>
        </div>
      </div>

      {active &&
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
                    {active === "client" && <ClientForm />}
                    {active === "company" && (
                      <CompanyForm />
                    )}
                    {active === "personal" && <PersonalCoachForm />}
                    {active === "staff" && (
                      <StaffCoachForm
                        onPersonalCoach={() => setActive("personal")}
                      />
                    )}
                  </div>
                </div>
              </div>,
              document.body,
            )
          : null)}
    </>
  );
}
