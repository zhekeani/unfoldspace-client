import { debounce } from "lodash";
import { useEffect, useState } from "react";

export const useAutosizeCarousel = (carousalItems: string[]) => {
  const [isLastItemVisible, setIsLastItemVisible] = useState(false);

  useEffect(() => {
    const observerCallback = debounce(
      ([entry]: IntersectionObserverEntry[]) => {
        setIsLastItemVisible(entry.isIntersecting);
      },
      100
    );

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      threshold: 1.0,
    });

    const lastItem = document.querySelector("[data-last-item]");
    if (lastItem) observer.observe(lastItem);

    return () => {
      if (lastItem) observer.unobserve(lastItem);
    };
  }, [carousalItems]);

  return { isLastItemVisible };
};
