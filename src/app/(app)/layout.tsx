"use client"

import { Sidebar } from "@/components/Layouts/sidebar";

import { Header } from "@/components/Layouts/header";
import { useEffect, useState, type PropsWithChildren } from "react";
import { CompanyProvider, ICompany } from "@/app/context/company-context";
import { SkeletonUI } from "@/components/ui/skeleton";

export default function RootLayout({ children }: PropsWithChildren) {
  const [company, setCompany] = useState<ICompany | null>(null);

  useEffect(() => {
    fetch("/api/company/overview")
      .then((res) => res.json())
      .then((res) => setCompany(res.data))
      .catch(console.error);
  }, []);

  if (!company) return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header workspaceName={<SkeletonUI className="h-5 w-50" />} mode={<SkeletonUI className="h-5 w-50" />} />
      </div>
    </div>
  );

  return (
    <CompanyProvider company={company}>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header workspaceName={company?.company_name} mode={company?.company_mode} />

          <main className="isolate mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:px-10 2xl:py-5">
            {children}
          </main>
        </div>
      </div>
    </CompanyProvider>
  );
}
