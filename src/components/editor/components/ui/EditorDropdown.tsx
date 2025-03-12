import { cn } from "@/lib/utils";
import React from "react";

export const EditorDropdownCategoryTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="text-[.65rem] font-semibold mb-1 uppercase text-neutral-500 dark:text-neutral-400 px-1.5">
      {children}
    </div>
  );
};

export const EditorDropdownButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }
>(function EditorDropdownButtonInner(
  { children, isActive, onClick, disabled, className },
  ref
) {
  const buttonClass = cn(
    "flex items-center gap-2 p-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 text-left bg-transparent w-full rounded",

    // ✅ Explicitly remove focus outline
    "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none",

    !isActive &&
      !disabled &&
      "hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200",

    isActive &&
      !disabled &&
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",

    disabled && "text-neutral-400 cursor-not-allowed dark:text-neutral-600",

    className
  );

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
});
