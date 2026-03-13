import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { AuthProvider } from "@/app/context/auth-context";
import { CompanyProvider } from "@/app/context/company-context";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import type { IAuthContext } from "@/types/auth-context";
import type { PropsWithChildren } from "react";

export default async function RootLayout({ children }: PropsWithChildren) {
  const auth: IAuthContext | null = await getAuthContext();

  if (!auth) {
    return null;
  }

  console.log(auth);

  return (
    <AuthProvider auth={auth}>
      <CompanyProvider company={auth.company}>
        <div className="flex min-h-screen">
          <Sidebar auth={auth} />

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
