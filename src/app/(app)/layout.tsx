import { getAuthContext } from "@/lib/auth/get-auth-context";
import type { IAuthContext } from "@/types/auth-context";
import AppLayout from "./app-layout";

export default async function RootLayout({ children }: any) {
  const auth: IAuthContext | null = await getAuthContext();
  
  if (!auth) {
    return null;
  }

  return (
    <>
      <AppLayout auth={auth} children={children}/>
    </>
  )
}
