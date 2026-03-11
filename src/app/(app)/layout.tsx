"use client"

import { Sidebar } from "@/components/Layouts/sidebar";

import { Header } from "@/components/Layouts/header";
import { useEffect, useState, type PropsWithChildren } from "react";
import { CompanyProvider } from "@/app/context/company-context";
import { SkeletonUI } from "@/components/ui/skeleton";
import { IAuthContext } from "@/types/auth-context";

export default function RootLayout({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<IAuthContext | null>(null);

  useEffect(() => {
    fetch("/api/auth/users")
      .then((res) => res.json())
      .then((res) => setAuth(res.data))
      .catch(console.error);
  }, []);

  if (!auth) return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header workspaceName={<SkeletonUI className="h-5 w-50" />} mode={<SkeletonUI className="h-5 w-50" />} />
      </div>
    </div>
  );

  return (
    <CompanyProvider company={auth.company}>
      <div className="flex min-h-screen">
        <Sidebar auth={auth}/>

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header workspaceName={auth.company?.name} mode={auth.company?.mode} />

          <main className="isolate mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:px-10 2xl:py-5">
            {children}
          </main>
        </div>
      </div>
    </CompanyProvider>
  );
}
