"use client";

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { key: T; label: string }[];
}) {
  return (
    <div className="flex gap-2 border-b border-gray-200 pb-2">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={[
              "rounded-lg border px-3 py-2 text-sm",
              active
                ? "border-gray-300 bg-gray-100 font-medium"
                : "border-gray-200 bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}