import { CheckIcon, XIcon } from "@/components/IconsCollection/icons";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useId } from "react";

type PropsType = {
  withIcon?: "check" | "x";
  withBg?: boolean;
  label: ReactNode;
  name?: string;
  minimal?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  radius?: "default" | "md";
  inputProps?: React.ComponentPropsWithRef<"input">;
  error?: string;
  id?: string;
};

export function Checkbox({
  withIcon,
  label,
  name,
  withBg,
  minimal,
  onChange,
  radius,
  inputProps,
  error,
  id: providedId,
}: PropsType) {
  const { className: inputClassName, onChange: inputOnChange, ...restInputProps } = inputProps ?? {};
  const autoId = useId();
  const id = providedId ?? restInputProps.id ?? autoId;
  const inputName = restInputProps.name ?? name;

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer select-none items-center",
          !minimal && "text-body-sm font-medium",
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            onChange={(e) => {
              inputOnChange?.(e);
              onChange?.(e);
            }}
            name={inputName}
            id={id}
            className={cn("peer sr-only", inputClassName)}
            {...restInputProps}
          />

          <div
            className={cn(
              "mr-2 flex size-5 items-center justify-center rounded border border-dark-5 peer-checked:border-primary dark:border-dark-6 peer-checked:[&>*]:block",
              withBg
                ? "peer-checked:bg-primary [&>*]:text-white"
                : "peer-checked:bg-gray-2 dark:peer-checked:bg-transparent",
              minimal && "mr-3 border-stroke dark:border-dark-3",
              radius === "md" && "rounded-md",
              error && "border-red-500 dark:border-red-400",
            )}
          >
            {!withIcon && (
              <span className="hidden size-2.5 rounded-sm bg-primary" />
            )}

            {withIcon === "check" && (
              <CheckIcon className="hidden text-primary" />
            )}

            {withIcon === "x" && <XIcon className="hidden text-primary" />}
          </div>
        </div>
        <span>{label}</span>
      </label>

      {error && <p className="mt-1 text-body-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
