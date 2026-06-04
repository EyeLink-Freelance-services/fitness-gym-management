"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateClientAction } from "@/app/(app)/dashboard/company/clients/actions";
import { mapCompanyClientToFormValues } from "@/modules/company/company-client.mappers";
import type {
  CompanyClient,
  CompanyClientFormValues,
  CompanyPricing,
} from "@/types/dashboard/company";

export function useClientProfileEdit(
  client: CompanyClient,
  companyPricing: CompanyPricing | null,
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CompanyClientFormValues>(() =>
    mapCompanyClientToFormValues(client),
  );

  function patch(partial: Partial<CompanyClientFormValues>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function cancelEdit() {
    setDraft(mapCompanyClientToFormValues(client));
    setIsEditing(false);
  }

  function save() {
    startTransition(async () => {
      try {
        await updateClientAction(client.id, draft, companyPricing);
        toast.success("Client profile updated.");
        setIsEditing(false);
        router.refresh();
      } catch {
        toast.error("Failed to save changes.");
      }
    });
  }

  return {
    isEditing,
    isPending,
    draft,
    patch,
    startEdit: () => setIsEditing(true),
    cancelEdit,
    save,
  };
}
