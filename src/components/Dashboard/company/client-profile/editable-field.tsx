import { cn } from "@/lib/utils";

export const profileFieldInputClass =
  "w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark transition-colors focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary";

type EditableFieldProps = {
  label: string;
  display: string;
  value: string;
  isEditing: boolean;
  type?: "text" | "email" | "tel" | "date";
  options?: { value: string; label: string }[];
  onChange: (value: string) => void;
};

export function EditableField({
  label,
  display,
  value,
  isEditing,
  type = "text",
  options,
  onChange,
}: EditableFieldProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-dark-6">
        {label}
      </p>
      {isEditing ? (
        options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={profileFieldInputClass}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={profileFieldInputClass}
          />
        )
      ) : (
        <p className="text-sm font-medium text-dark dark:text-white">
          {display || "—"}
        </p>
      )}
    </div>
  );
}

export function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
  );
}

export function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-dark-6">
        {label}
      </p>
      <p className="text-sm font-medium text-dark dark:text-white">{value}</p>
    </div>
  );
}

export function MedicalConditionsField({
  label,
  display,
  value,
  isEditing,
  onChange,
}: {
  label: string;
  display: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-dark-6">
        {label}
      </p>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="Medical conditions or restrictions…"
          className={cn(profileFieldInputClass, "resize-none")}
        />
      ) : (
        <p className="text-sm font-medium text-dark dark:text-white">
          {display || "—"}
        </p>
      )}
    </div>
  );
}
