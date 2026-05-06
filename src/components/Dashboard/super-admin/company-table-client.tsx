"use client";

import { DataTable } from "@/components/Tables";
import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { SuperAdminCompanyRow } from "@/types/dashboard/super-admin";
import { superAdminCompanyColumns } from "@/components/Dashboard/table-column/super-admin-column";
import { useEffect, useId, useState } from "react";
import { CompanyFormData } from "@/types/forms";
import { createPortal } from "react-dom";
import CompanyForm from "@/components/Forms/CompanyForm";
import { useRouter } from "next/navigation";

interface CompanyTableClientProps {
  data: SuperAdminCompanyRow[];
}

export default function CompanyTableClient({ data }: CompanyTableClientProps) {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] =
    useState<SuperAdminCompanyRow | null>(null);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCompany(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedCompany]);

  const selectedCompanyFormData: CompanyFormData | undefined = selectedCompany
    ? {
        companyName: selectedCompany.company_name,
        brn: selectedCompany.business_reg_no,
        email: selectedCompany.email,
        contactNumber: selectedCompany.contact_number,
        addressLine1: selectedCompany.address_line_1,
        city: selectedCompany.city,
        postcode: selectedCompany.postcode,
        state: selectedCompany.district,
        branches: selectedCompany.branches.map((branch) => ({
          branchName: branch,
        })),
        standardPrice: selectedCompany.standard_price,
        hasPremiumPlan: selectedCompany.has_premium_plan,
        premiumPrice: selectedCompany.premium_price ?? undefined,
        disclaimer: selectedCompany.disclaimer_text,
        agreeTerms: false,
      }
    : undefined;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
             <FormModalTrigger
            buttonLabel="+ Add Company"
            formType="company"
            onSuccess={() => router.refresh()}
          />
        </div>

        <DataTable
          title="Companies"
          description="Companies across all locations."
          data={data}
          columns={superAdminCompanyColumns}
          searchPlaceholder="Search company, brn, contact..."
          initialPageSize={10}
          emptyStateLabel="No companies available."
          getRowId={(row) => row.id}
          onRowClick={setSelectedCompany}
          tableClassName="min-w-[760px]"
        />
      </div>

      {selectedCompany &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedCompany(null);
              }
            }}
          >
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
              <div className="max-h-[85vh] overflow-y-auto p-4">
                <CompanyForm
                  mode="edit"
                  initialData={selectedCompanyFormData}
                  existingProfilePhotoUrl={
                    selectedCompany.company_logo ?? undefined
                  }
                  onSuccess={() => setSelectedCompany(null)}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
