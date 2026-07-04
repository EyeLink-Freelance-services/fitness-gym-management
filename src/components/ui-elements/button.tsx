"use client";

import { ButtonProps } from "@/types/shared";
import { cva } from "class-variance-authority";
import { toast } from "sonner";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 font-medium transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-gray-4 disabled:text-dark-5 dark:disabled:bg-dark-3 dark:disabled:text-dark-6 disabled:hover:bg-opacity-100",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        green: "bg-green text-white",
        danger: "bg-red text-white",
        dark: "bg-dark text-white dark:bg-white/10",
        disabled:'bg-gray-300 text-gray',
        outlinePrimary:
          "border border-primary hover:bg-primary/10 text-primary",
        outlineGreen: "border border-green hover:bg-green/10 text-green",
        outlineDark:
          "border border-dark hover:bg-dark/10 text-dark dark:hover:bg-white/10 dark:border-white/25 dark:text-white",
      },
      shape: {
        default: "rounded-[10px]",
        rounded: "rounded-[5px]",
        full: "rounded-full",
      },
      size: {
        default: "py-3.5 px-10 py-3.5 lg:px-8 xl:px-10",
        small: "py-[11px] px-6",
        xs: "py-1 px-4"
      },
    },
    defaultVariants: {
      variant: "primary",
      shape: "default",
      size: "default",
    },
  },
);

export function Button({
  label,
  icon,
  variant,
  shape,
  size,
  className,
  toastMessage,
  onClick,
  loading = false,
  loadingLabel,
  disabled,
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
    if (toastMessage) toast(toastMessage);
    onClick?.(e);
  };

  return (
    <button
      className={buttonVariants({ variant, shape, size, className })}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden
        />
      ) : (
        icon && <span>{icon}</span>
      )}
      {loading ? (loadingLabel ?? label) : label}
    </button>
  );
}
