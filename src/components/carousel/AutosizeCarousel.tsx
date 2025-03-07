import { Button } from "@/components/ui/button";
import { useCarousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps, forwardRef, HTMLAttributes } from "react";

const AutosizeCarouselContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn("flex -ml-4", className)} {...props} />
    </div>
  );
});
AutosizeCarouselContent.displayName = "AutosizeCarouselContent";

const AutosizeCarouselItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 pl-6", className)}
      {...props}
    />
  );
});
AutosizeCarouselItem.displayName = "AutosizeCarouselItem";

const AutosizeCarouselNext = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, variant = "ghost", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();

  if (!canScrollNext) return null;

  return (
    <>
      <div className="absolute right-0 top-0 h-[110%] w-[100px] bg-gradient-to-l from-white via-white/60 to-transparent pointer-events-none" />
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute  h-8 w-8 rounded-full shadow-none bg-transparent",
          "-right-2 top-1/2 -translate-y-1/2 text-sub-text hover:bg-transparent",
          className
        )}
        onClick={scrollNext}
        {...props}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    </>
  );
});
AutosizeCarouselNext.displayName = "AutosizeCarouselNext";

const AutosizeCarouselPrevious = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, variant = "ghost", size = "icon", ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  if (!canScrollPrev) return null;

  return (
    <>
      <div className="absolute left-0 top-0 h-[110%] w-[100px] bg-gradient-to-r from-white via-white/60 to-transparent pointer-events-none" />
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute  h-8 w-8 rounded-full shadow-none",
          "-left-2 top-1/2 -translate-y-1/2 text-sub-text hover:bg-transparent",
          className
        )}
        onClick={scrollPrev}
        {...props}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    </>
  );
});
AutosizeCarouselPrevious.displayName = "AutosizeCarouselPrevious";

export {
  AutosizeCarouselContent,
  AutosizeCarouselItem,
  AutosizeCarouselNext,
  AutosizeCarouselPrevious,
};
