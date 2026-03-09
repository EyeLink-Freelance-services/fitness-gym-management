"use client";

import { createContext, useContext } from "react";

export interface ICompany {
  company_id: string;
  company_name: string;
  company_mode: string;
}

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