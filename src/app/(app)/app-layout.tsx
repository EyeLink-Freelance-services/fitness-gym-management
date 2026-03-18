'use client'

import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { ROUTES } from "@/constants/route";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/auth-context";
import { CompanyProvider } from "../context/company-context";
import { IAuthContext } from "@/types/auth-context";

type LayoutProps = {
  auth: IAuthContext,
  children: any;
}

export default function AppLayout({auth, children}: LayoutProps) {
    const pathname = usePathname();

    const hideSidebar =
        pathname.startsWith(ROUTES.TRAINING_PLANS.TEMPLATES) &&
        pathname !== ROUTES.TRAINING_PLANS.TEMPLATES;

    const isMobile = useIsMobile();

    return (
      <AuthProvider auth={auth}>
        <CompanyProvider company={auth.company}>
          <div className="flex min-h-screen">
            {(!hideSidebar || isMobile) && <Sidebar auth={auth} />}
            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header
                workspaceName={auth.company?.name}
                mode={auth.company?.mode}
              />
              <main className="isolate mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:px-10 2xl:py-5">
                {children}
              </main>
            </div>
          </div>
        </CompanyProvider>
    </AuthProvider>
    )

}