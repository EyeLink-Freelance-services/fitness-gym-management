import { cn } from "@/lib/utils";
import { FormLabel } from "@/types/forms";

const Label = ({
  value,
  as = "span",
  htmlFor,
  required,
  optional,
  className,
}: FormLabel) => {
  const Comp = as;

  return (
    <Comp
      {...(as === "label" ? { htmlFor } : {})}
      className={cn(
        "block text-body-sm font-medium tracking-widest text-dark dark:text-white",
        className,
      )}
    >
      {value}{" "}
      {optional && (
        <span className="rounded-sm bg-gray-200 px-2 py-0.5 text-xs text-dark-5 dark:bg-dark-6 dark:text-black">
          optional
        </span>
      )}
      {required && <span className="ml-1 select-none text-red">*</span>}
    </Comp>
  );
};

export default Label;
