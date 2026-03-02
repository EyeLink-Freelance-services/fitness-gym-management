import { cn } from "@/lib/utils";
import { useId } from "react";

type PropsType = {
  variant?: "dot" | "circle";
  label: React.ReactNode;
  name?: string;
  value?: string;
  minimal?: boolean;
  className?: string;
  inputProps?: React.ComponentPropsWithRef<"input">;
  id?: string;
};

export function RadioInput({
  label,
  variant = "dot",
  name,
  value,
  minimal,
  className,
  inputProps,
  id: providedId,
}: PropsType) {
  const { className: inputClassName, ...restInputProps } = inputProps ?? {};
  const autoId = useId();
  const id = providedId ?? restInputProps.id ?? autoId;
  const inputName = restInputProps.name ?? name;
  const inputValue = restInputProps.value ?? value;

  if (minimal) {
    return (
      <div className={cn("flex-1", className)}>
        <input
          type="radio"
          name={inputName}
          id={id}
          className={cn("peer sr-only", inputClassName)}
          value={inputValue}
          {...restInputProps}
        />

        <label
          htmlFor={id}
          className={cn(
            "flex w-full cursor-pointer select-none items-center justify-center gap-2 rounded-lg border border-stroke px-6 py-3 text-body-sm font-medium uppercase tracking-[0.35em] text-dark-5 transition dark:border-dark-3 dark:text-dark-6",
            "hover:border-primary/70 dark:hover:border-primary/70",
            "peer-checked:border-primary peer-checked:text-dark dark:peer-checked:text-white",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-transparent",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
          )}
        >
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white"
      >
        <div className="relative">
          <input
            type="radio"
            name={inputName}
            id={id}
            className={cn("peer sr-only", inputClassName)}
            value={inputValue}
            {...restInputProps}
          />
          <div
            className={cn(
              "mr-2 flex size-5 items-center justify-center rounded-full border peer-checked:[&>*]:block",
              {
                "border-primary peer-checked:border-6": variant === "circle",
                "border-dark-5 peer-checked:border-primary peer-checked:bg-gray-2 dark:border-dark-6 dark:peer-checked:bg-dark-2":
                  variant === "dot",
              },
            )}
          >
            <span
              className={cn(
                "hidden size-2.5 rounded-full bg-primary",
                variant === "circle" && "bg-transparent",
              )}
            />
          </div>
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
}
