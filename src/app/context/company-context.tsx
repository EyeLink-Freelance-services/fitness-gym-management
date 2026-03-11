"use client";

import { ICompany } from "@/types/auth-context";
import { createContext, useContext } from "react";

const CompanyContext = createContext<ICompany | null>(null);

export function CompanyProvider({
  company,
  children,
}: {
  company: ICompany;
  children: React.ReactNode;
}) {
  return (
    <CompanyContext.Provider value={company}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used inside CompanyProvider");
  }
  return context;
}