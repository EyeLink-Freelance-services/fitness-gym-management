"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { SessionStorageSync } from "@/components/Auth/session-storage-sync";
import { SessionAutoRefresh } from "@/components/Auth/session-auto-refresh";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        <SidebarProvider>
          <SessionStorageSync />
          <SessionAutoRefresh />
          {children}
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
