"use client";

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { key: T; label: string; count?: string }[];
}) {
  return (
    <div className="relative w-full border-b border-stroke dark:border-dark-3">
      <div className="flex gap-6">
        {tabs.map((t) => {
          const active = value === t.key;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "relative pb-3 text-sm font-medium transition-all duration-200",
                active
                  ? "text-black dark:text-white"
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white",
              ].join(" ")}
            >
              {t.label}
              {t.count && (
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-dark-3">
                  {t.count}
                </span>
              )}

              {/* Active underline */}
              <span
                className={[
                  "absolute left-0 bottom-0 h-[2px] w-full rounded-full transition-all duration-300",
                  active
                    ? "bg-black dark:bg-white"
                    : "bg-transparent",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}