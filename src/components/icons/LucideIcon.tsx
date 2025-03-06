import { cn } from "@/lib/utils";
import { icons } from "lucide-react";
import { memo } from "react";

export type LucideIconProps = {
  name: keyof typeof icons;
  className?: string;
  strokeWidth?: number;
};

export const LucideIcon = memo(
  ({ name, className, strokeWidth }: LucideIconProps) => {
    const LucideIconComponent = icons[name];

    if (!LucideIconComponent) {
      return null;
    }

    return (
      <LucideIconComponent
        className={cn("w-4 h-4", className)}
        strokeWidth={strokeWidth || 2.5}
      />
    );
  }
);

LucideIcon.displayName = "LucideIcon";
