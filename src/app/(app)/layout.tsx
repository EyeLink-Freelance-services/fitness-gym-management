import { getAuthContext } from "@/lib/auth/get-auth-context";
import type { IAuthContext } from "@/types/auth-context";
import { AuthProvider } from "../context/auth-context";
import { CompanyProvider } from "../context/company-context";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";

export default async function RootLayout({ children }: any) {
  const auth: IAuthContext | null = await getAuthContext();
  
  if (!auth) {
    return null;
  }

  return (
    <AuthProvider auth={auth}>
        <CompanyProvider company={auth.company}>
          <div className="flex min-h-screen">
            <Sidebar auth={auth} />
            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />
              <main className="isolate mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:px-10 2xl:py-5">
                {children}
              </main>
            </div>
          </div>
        </CompanyProvider>
    </AuthProvider>
  )
}
