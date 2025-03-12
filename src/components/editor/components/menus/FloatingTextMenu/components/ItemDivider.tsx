import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export type ItemDividerProps = HTMLAttributes<HTMLDivElement>;

const ItemDivider = ({ className, ...props }: ItemDividerProps) => {
  const dividerClassName = cn(
    "bg-neutral-200 dark:bg-neutral-800",
    "w-full min-w-[1.5rem] h-[1px] my-1 first:mt-0 last:mt-0",
    className
  );

  return <div className={dividerClassName} {...props} />;
};

export default ItemDivider;
