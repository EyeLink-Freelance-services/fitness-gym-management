"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { SessionStorageSync } from "@/components/Auth/session-storage-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <SidebarProvider>
          <SessionStorageSync />
          {children}
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
