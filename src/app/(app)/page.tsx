import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getRedirectPathForAuth } from "@/lib/auth/permission";
 
export default async function Home() {
  const auth = await getAuthContext();
  const redirectPath = getRedirectPathForAuth(auth);

  if (redirectPath) {
    redirect(redirectPath);
  }

  return null;
}
