import { SubsectionTab } from "@/components/carousel/SubsectionTabsCarousel";

export const generateUserSubsectionTabs = (
  username: string
): SubsectionTab[] => {
  return [
    {
      label: "Home",
      path: `/%40${username}/homes`,
    },
    {
      label: "Lists",
      path: `/%40${username}/lists`,
    },
    {
      label: "About",
      path: `/%40${username}/about`,
    },
  ];
};
