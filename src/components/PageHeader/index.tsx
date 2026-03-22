'use client';

import { ArrowLeftIcon } from "@/components/IconsCollection/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  backHref?: string; // if provided → use Link
  onBack?: () => void; // fallback (router.back)
  rightContent?: React.ReactNode; // optional actions (buttons, etc.)
};

export default function PageHeader({
  title,
  description,
  backHref,
  onBack,
  rightContent,
}: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();
    router.back();
  };

  const BackButton = (
    <button
      onClick={handleBack}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stroke bg-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-white/5"
    >
      <ArrowLeftIcon />
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-6 lg:px-0">
      <div className="flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          {backHref ? (
            <Link href={backHref}>{BackButton}</Link>
          ) : (
            BackButton
          )}

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-dark dark:text-white md:text-2xl">
              {title}
            </h1>

            {description && (
              <p className="text-sm text-dark-5 dark:text-dark-6">
                {description}
              </p>
            )}
          </div>
        </div>

        {rightContent && <div>{rightContent}</div>}
      </div>
    </div>
  );
}