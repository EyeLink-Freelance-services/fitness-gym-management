"use client";

import { ROUTES } from "@/constants/route";
import { useState } from "react";

export default function InviteLink({ result }: any) {
  const [copied, setCopied] = useState(false);

  const link = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.ONBOARDING.ACCEPT}?token=${result.rawtoken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!result?.rawtoken) return null;

  return (
    <div className="mt-6 rounded-xl bg-gray-1 p-4 dark:bg-dark-2">
      <p className="mb-2 font-medium">
        Invitation created for {result.email}
      </p>

      <div className="flex items-center gap-2">
        <p className="flex-1 break-all text-sm text-dark dark:text-gray-3">
          {link}
        </p>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm text-white hover:opacity-90"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}