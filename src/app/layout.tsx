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
    template: "%s | NextAdmin - Next.js Dashboard Kit",
    default: "NextAdmin - Next.js Dashboard Kit",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-[url('/images/common/bg.jpg')] bg-cover bg-center bg-no-repeat">
          <Providers>
            <NextTopLoader color="#5750F1" showSpinner={false} />
            {children}
            <ToastProvider />
          </Providers>
        </div>
      </body>
    </html>
  );
}
