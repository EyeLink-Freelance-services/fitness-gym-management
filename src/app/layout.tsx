import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";

import { Providers } from "./(app)/providers";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: {
    template: "%s | Fitness | Coaching Management",
    default: "Fitness | Coaching Management",
  },
  description:
    "A modern gym management platform for coaches, gyms, and clients. Track progress, manage onboarding, analytics, sessions, and more...",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
