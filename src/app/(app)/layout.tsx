import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/Layouts/sidebar";

import { Header } from "@/components/Layouts/header";
import type { PropsWithChildren } from "react";
import { supabaseServer } from "@/lib/supabase/server";

interface ICompany {
  company_id: string,
  company_name: string,
  company_mode: string
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = await supabaseServer();

  // const {data: {session}} = await supabase.auth.getSession();
  // if(!session) return; //not logged in

  const { data , error } = await supabase.rpc("ensure_active_company");
  
  if(error) {
    console.error(error)
    return <div>{error.message}</div> 
  }

  const companyOverview: ICompany = data 

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header workspaceName={companyOverview?.company_name} mode={companyOverview?.company_mode} />

        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
