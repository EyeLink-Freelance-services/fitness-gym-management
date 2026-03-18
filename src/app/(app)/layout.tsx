import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { AuthProvider } from "@/app/context/auth-context";
import { CompanyProvider } from "@/app/context/company-context";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import type { IAuthContext } from "@/types/auth-context";
import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { ROUTES } from "@/constants/route";

export default async function RootLayout({ children }: PropsWithChildren) {
  const auth: IAuthContext | null = await getAuthContext();
  const pathname = usePathname();

  if (!auth) {
    return null;
  }

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
  );
}
