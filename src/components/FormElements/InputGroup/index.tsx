import { cn } from "@/lib/utils";
import { type HTMLInputTypeAttribute, useId } from "react";
import Label from "@/components/FormElements/common/label";

type InputGroupProps = {
  className?: string;
  labelClassName?: string;
  label: React.ReactNode;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
  fileStyleVariant?: "style1" | "style2";
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  height?: "sm" | "default";
  defaultValue?: string;
  inputProps?: React.ComponentPropsWithRef<"input">;
  error?: string;
  id?: string;
};

const InputGroup: React.FC<InputGroupProps> = ({
  className,
  labelClassName,
  label,
  type,
  placeholder,
  required,
  disabled,
  active,
  handleChange,
  icon,
  inputProps,
  error,
  id: providedId,
  ...props
}) => {
  const { className: inputClassName, ...restInputProps } = inputProps ?? {};
  const autoId = useId();
  const id = providedId ?? restInputProps.id ?? autoId;
  const isRequired = restInputProps.required ?? required;
  const isDisabled = restInputProps.disabled ?? disabled;
  const inputName = restInputProps.name ?? props.name;
  const onChange = restInputProps.onChange ?? handleChange;
  const value = (restInputProps.value ?? props.value) as
    | string
    | number
    | readonly string[]
    | undefined;
  const defaultValue = restInputProps.defaultValue ?? props.defaultValue;

  return (
    <div className={className}>
      <Label
        as="label"
        htmlFor={id}
        value={label}
        required={Boolean(isRequired)}
        className={labelClassName}
      />

      <div
        className={cn(
          "relative mt-3 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2",
          props.iconPosition === "left"
            ? "[&_svg]:left-4.5"
            : "[&_svg]:right-4.5",
        )}
      >
        <input
          id={id}
          type={type}
          name={inputName}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            "w-full rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
            type === "file"
              ? getFileStyles(props.fileStyleVariant!)
              : "px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white",
            props.iconPosition === "left" && "pl-12.5",
            props.height === "sm" && "py-2.5",
            error &&
              "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400",
            inputClassName,
          )}
          required={isRequired}
          disabled={isDisabled}
          data-active={active}
          {...restInputProps}
        />

        {icon}
      </div>

      {error && (
        <p className="mt-1 text-body-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputGroup;

function getFileStyles(variant: "style1" | "style2") {
  switch (variant) {
    case "style1":
      return `file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white`;
    default:
      return `file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 file:focus:border-primary dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white px-3 py-[9px]`;
  }
}
