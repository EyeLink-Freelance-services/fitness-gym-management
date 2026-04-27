"use client";

import { ICompany } from "@/types/auth/auth-context";
import { createContext, useContext } from "react";

const CompanyContext = createContext<ICompany | null>(null);

export function CompanyProvider({
  company,
  children,
}: {
  company: ICompany | null;
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
  return context;
}