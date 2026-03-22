"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

export const closeButtonVariants = cva(
  "inline-flex items-center justify-center transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-70",
  {
    variants: {
      variant: {
        default:
          "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700",
        primary:
          "bg-primary text-white hover:bg-primary/90",
        danger:
          "bg-red text-white hover:bg-red/90",
        ghost:
          "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        dark:
          "bg-dark text-white hover:bg-dark/90 dark:bg-white/10",
      },
      shape: {
        default: "rounded-[10px]",
        rounded: "rounded-[5px]",
        full: "rounded-full",
      },
      size: {
        xs: "h-7 w-7",
        small: "h-8 w-8",
        default: "h-9 w-9",
        large: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "full",
      size: "default",
    },
  }
);

type CloseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof closeButtonVariants> & {
    icon?: React.ReactNode;
    toastMessage?: string;
  };

export function CloseButton({
  icon,
  variant,
  shape,
  size,
  className,
  toastMessage,
  onClick,
  ...props
}: CloseButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (toastMessage) toast(toastMessage);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      aria-label="Close"
      className={clsx(closeButtonVariants({ variant, shape, size }), className)}
      onClick={handleClick}
      {...props}
    >
      {icon ?? <X className="h-4 w-4" />}
    </button>
  );
}