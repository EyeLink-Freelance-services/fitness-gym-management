type Props = {
  badge?: string;
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
  compact?: boolean;
};

export default function SectionHeader({
  badge,
  title,
  description,
  rightContent,
  compact = false,
}: Props) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 to-transparent" />

      <div
        className={`relative ${
          compact ? "px-4 py-3" : "px-5 py-5"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            {badge && (
              <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {badge}
              </div>
            )}

            {!compact && (
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-dark dark:text-white">
                  {title}
                </h2>

                {description && (
                  <p className="mt-1 text-sm leading-6 text-dark-5 dark:text-dark-6">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>

          {rightContent && <div>{rightContent}</div>}
        </div>
      </div>
    </div>
  );
}