import { ButtonHTMLAttributes, forwardRef, HTMLProps } from "react";

import {
  EditorButton,
  EditorButtonProps,
} from "@/components/editor/components/ui/EditorButton";
import { Surface } from "@/components/editor/components/ui/Surface";
import { cn } from "@/lib/utils";

export type EditorToolbarWrapperProps = {
  shouldShowContent?: boolean;
  isVertical?: boolean;
} & HTMLProps<HTMLDivElement>;

const EditorToolbarWrapper = forwardRef<
  HTMLDivElement,
  EditorToolbarWrapperProps
>(
  (
    {
      shouldShowContent = true,
      children,
      isVertical = false,
      className,
      ...rest
    },
    ref
  ) => {
    const toolbarClassName = cn(
      "text-black inline-flex h-full leading-none gap-0.5",
      isVertical ? "flex-col p-2" : "flex-row p-1 items-center",
      className
    );

    return (
      shouldShowContent && (
        <Surface className={toolbarClassName} {...rest} ref={ref}>
          {children}
        </Surface>
      )
    );
  }
);

EditorToolbarWrapper.displayName = "EditorToolbar";

export type EditorToolbarDividerProps = {
  horizontal?: boolean;
} & HTMLProps<HTMLDivElement>;

const EditorToolbarDivider = forwardRef<
  HTMLDivElement,
  EditorToolbarDividerProps
>(({ horizontal, className, ...rest }, ref) => {
  const dividerClassName = cn(
    "bg-neutral-200 dark:bg-neutral-800",
    horizontal
      ? "w-full min-w-[1.5rem] h-[1px] my-1 first:mt-0 last:mt-0"
      : "h-full min-h-[1.5rem] w-[1px] mx-1 first:ml-0 last:mr-0",
    className
  );

  return <div className={dividerClassName} ref={ref} {...rest} />;
});

EditorToolbarDivider.displayName = "EditorToolbar.Divider";

export type EditorToolbarButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
    activeClassname?: string;
    buttonSize?: EditorButtonProps["buttonSize"];
    variant?: EditorButtonProps["variant"];
  };

const EditorToolbarButton = forwardRef<
  HTMLButtonElement,
  EditorToolbarButtonProps
>(
  (
    {
      children,
      buttonSize = "icon",
      variant = "ghost",
      className,
      activeClassname,
      ...rest
    },
    ref
  ) => {
    const buttonClass = cn("gap-1 min-w-[2rem] px-2 w-auto", className);

    return (
      <EditorButton
        activeClassname={activeClassname}
        className={buttonClass}
        variant={variant}
        buttonSize={buttonSize}
        ref={ref}
        {...rest}
      >
        {children}
      </EditorButton>
    );
  }
);

EditorToolbarButton.displayName = "EditorToolbarButton";

export const EditorToolbar = {
  Wrapper: EditorToolbarWrapper,
  Divider: EditorToolbarDivider,
  Button: EditorToolbarButton,
};
