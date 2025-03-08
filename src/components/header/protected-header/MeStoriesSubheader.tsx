import SubsectionTabsCarousel, {
  SubsectionTab,
} from "@/components/carousel/SubsectionTabsCarousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subsectionTabs: SubsectionTab[] = [
  {
    label: "Drafts",
    path: "/me/stories/drafts",
  },
  {
    label: "Published",
    path: "/me/stories/public",
  },
  {
    label: "Responses",
    path: "/me/stories/responses",
  },
];

const MeStoriesSubheader = () => {
  return (
    <div className="w-auto mt-6 mb-6 tablet:mt-[52px] tablet:mb-6 px-6">
      <div className="mb-6 tablet:mb-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="font-medium tablet:text-4xl text-2xl">Your stories</h2>
        </div>

        <div>
          <Button
            className={cn(
              "rounded-full bg-main-green font-normal",
              "mobile:h-9 mobile:px-4 py-2 mobile:has-[>svg]:px-3 h-8 gap-1.5 px-3 has-[>svg]:px-2.5"
            )}
          >
            Write Story
          </Button>
        </div>
      </div>
      <SubsectionTabsCarousel subsectionTabs={subsectionTabs} />
    </div>
  );
};

export default MeStoriesSubheader;
