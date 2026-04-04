import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";

const menuItemBaseStyles = cva(
  "rounded-lg px-3.5 font-medium text-dark-4 transition-all duration-200 dark:text-dark-6",
  {
    variants: {
      isActive: {
        true: "bg-[rgba(87,80,241,0.07)] text-primary hover:bg-[rgba(87,80,241,0.07)] dark:bg-[#FFFFFF1A] dark:text-white",
        false:
          "hover:bg-gray-100 hover:text-dark hover:dark:bg-[#FFFFFF1A] hover:dark:text-white",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
    disabled?: boolean;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string }),
) {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const disabledClasses =
    props.disabled
      ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-current dark:hover:bg-transparent dark:hover:text-current"
      : "";

  if (props.as === "link") {
    if (props.disabled) {
      return (
        <span
          aria-disabled="true"
          className={cn(
            menuItemBaseStyles({
              isActive: false,
              className: "relative block py-2",
            }),
            disabledClasses,
            props.className,
          )}
        >
          {props.children}
        </span>
      );
    }

    return (
      <Link
        href={props.href}
        // Close sidebar on clicking link if it's mobile
        onClick={() => isMobile && toggleSidebar()}
        className={cn(
          menuItemBaseStyles({
            isActive: props.isActive,
            className: "relative block py-2",
          }),
          disabledClasses,
          props.className,
        )}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      disabled={props.disabled}
      className={menuItemBaseStyles({
        isActive: props.isActive,
        className: cn("flex w-full items-center gap-3 py-3", disabledClasses),
      })}
    >
      {props.children}
    </button>
  );
}
