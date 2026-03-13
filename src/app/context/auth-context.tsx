"use client";

import type { IAuthContext } from "@/types/auth-context";
import { createContext, useContext } from "react";

const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({
  auth,
  children,
}: {
  auth: IAuthContext;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
