"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { companyClientColumns } from "@/components/Dashboard/table-column/company-columns";
import ClientForm from "@/components/Forms/ClientForm";
import { DataTable } from "@/components/Tables";
import type { CompanyClientRow, CompanyPricing } from "@/types/dashboard/company";
import { ClientFormData } from "@/types/forms";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

interface CompanyClientsTableClientProps {
  data: CompanyClientRow[];
  companyPricing: CompanyPricing | null;
}

export function CompanyClientsTableClient({
  data,
  companyPricing,
}: CompanyClientsTableClientProps) {
  const [selectedClient, setSelectedClient] = useState<CompanyClientRow | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedClient) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedClient(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedClient]);

  const selectedClientFormData: ClientFormData | undefined = selectedClient
    ? {
        firstName: selectedClient.name.split(" ")[0] ?? "",
        lastName: selectedClient.name.split(" ").slice(1).join(" ") || "",
        dateOfBirth: "",
        gender: "",
        email: "",
        phone: selectedClient.contact ?? "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        medicalConditions: "",
        membershipPlan:
          selectedClient.plan?.trim().toLowerCase() === "premium"
            ? "premium"
            : "standard",
        membershipPrice: selectedClient.price,
        customFee: undefined,
        assignedCoach: selectedClient.coach ?? "",
        startDate: selectedClient.joinedAt ?? "",
        agreeTerms: false,
      }
    : undefined;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <FormModalTrigger
            buttonLabel="+ Add Client"
            formType="client"
            clientContext="company"
            size="small"
          />
        </div>

        <DataTable
          title="Clients"
          description="Clients from the company"
          data={data}
          columns={companyClientColumns}
          getRowId={(row) => row.id}
          tableClassName="min-w-[780px]"
          searchPlaceholder="Search client, contact, plan..."
          initialPageSize={8}
          emptyStateLabel="No clients available."
          onRowClick={setSelectedClient}
        />
      </div>

      {selectedClient &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedClient(null);
              }
            }}
          >
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
              <div className="max-h-[85vh] overflow-y-auto p-4">
                <ClientForm
                  mode="edit"
                  clientContext="company"
                  initialData={selectedClientFormData}
                  companyPricing={companyPricing}
                  onSuccess={() => setSelectedClient(null)}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
