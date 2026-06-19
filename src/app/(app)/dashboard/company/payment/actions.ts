"use server";

import {
  getCompanyPaymentAfterPay,
  getCompanyPayments,
  payClientPayment,
} from "@/services/company/company-payment.service";
import { revalidatePath } from "next/cache";

export async function fetchCompanyPaymentPage(
  pageNumber: number,
  pageSize: number,
  billingMonth: string,
) {
  const { payments, totalCount } = await getCompanyPayments({
    pageNumber,
    pageSize,
    billingMonth,
  });

  return {
    payments,
    totalCount,
  };
}

export async function markClientPaymentPaidAction(
  clientId: string,
  billingMonth: string,
) {
  try {
    await payClientPayment(clientId, { billingMonth });
  } catch (error) {
    const confirmed = await waitForConfirmedPayment(clientId, billingMonth);
    if (confirmed?.isPaid) {
      revalidatePath("/dashboard/company/payment");
      return;
    }

    const message = error instanceof Error ? error.message : String(error);
    const isNetworkError =
      message.includes("fetch failed") ||
      message.includes("Backend API request failed");

    if (isNetworkError) {
      revalidatePath("/dashboard/company/payment");
      return;
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to record payment");
  }

  revalidatePath("/dashboard/company/payment");
}

async function waitForConfirmedPayment(
  clientId: string,
  billingMonth: string,
) {
  for (const delayMs of [0, 750, 1500]) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const confirmed = await getCompanyPaymentAfterPay(clientId, billingMonth);
    if (confirmed?.isPaid) return confirmed;
  }

  return null;
}
