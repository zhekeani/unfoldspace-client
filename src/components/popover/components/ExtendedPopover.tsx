import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";

type PopoverGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const PopoverGroup = ({
  children,
  className,
  ...props
}: PopoverGroupProps) => {
  return (
    <div
      className={cn("py-1.5 flex flex-col items-start", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const PopoverDivider = () => {
  return <div className="w-full h-[1px] bg-complement-light-gray" />;
};

type PopoverButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "danger" | "success";
  children: ReactNode;
};

export const PopoverButton = ({
  children,
  variant = "default",
  className,
  asChild = false,
  ...props
}: PopoverButtonProps & { asChild?: boolean }) => {
  return (
    <Button
      asChild={asChild}
      variant={"ghost"}
      className={cn(
        "font-normal hover:text-main-text transition-colors",
        variant === "default" && "text-sub-text",
        variant === "danger" && "text-destructive",
        variant === "success" && "text-main-green",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
