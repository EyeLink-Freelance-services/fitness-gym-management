import { cn } from "@/lib/utils";
import { useId } from "react";
import Label from "@/components/FormElements/common/label";

interface PropsType {
  label: React.ReactNode;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  icon?: React.ReactNode;
  defaultValue?: string;
  textareaProps?: React.ComponentPropsWithRef<"textarea">;
  error?: string;
  id?: string;
}

export function TextAreaGroup({
  label,
  placeholder,
  required,
  disabled,
  active,
  className,
  icon,
  defaultValue,
  textareaProps,
  error,
  id: providedId,
}: PropsType) {
  const { className: textareaClassName, ...restTextareaProps } = textareaProps ?? {};
  const autoId = useId();
  const id = providedId ?? restTextareaProps.id ?? autoId;
  const isRequired = restTextareaProps.required ?? required;
  const isDisabled = restTextareaProps.disabled ?? disabled;
  const defaultFormValue = restTextareaProps.defaultValue ?? defaultValue;

  return (
    <div className={cn(className)}>
      <Label
        as="label"
        htmlFor={id}
        value={label}
        required={Boolean(isRequired)}
        className="mb-3"
      />

      <div className="relative mt-3 [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:left-5.5 [&_svg]:top-5.5">
        <textarea
          id={id}
          rows={6}
          placeholder={placeholder}
          defaultValue={defaultFormValue}
          className={cn(
            "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
            icon && "py-5 pl-13 pr-5",
            error && "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400",
            textareaClassName,
          )}
          required={isRequired}
          disabled={isDisabled}
          data-active={active}
          {...restTextareaProps}
        />

        {icon}
      </div>

      {error && <p className="mt-1 text-body-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
