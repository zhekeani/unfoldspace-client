import { cn } from "../../../lib/utils";
import SubsectionTabsCarousel, {
  SubsectionTab,
} from "../../carousel/SubsectionTabsCarousel";
import { Button } from "../../ui/button";

const subsectionTabs: SubsectionTab[] = [
  {
    label: "Your lists",
    path: "/me/lists",
  },
  {
    label: "Saved lists",
    path: "/me/lists/saved",
  },
  {
    label: "Reading history",
    path: "/me/lists/reading-history",
  },
];

const MeListsSubheader = async () => {
  return (
    <div className="w-auto mt-6 mb-6 tablet:mt-[52px] tablet:mb-6 px-6">
      <div className="mb-6 tablet:mb-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="font-medium tablet:text-4xl text-2xl">Your library</h2>
        </div>

        <div>
          <Button
            className={cn(
              "rounded-full bg-main-green font-normal",
              "mobile:h-9 mobile:px-4 py-2 mobile:has-[>svg]:px-3 h-8 gap-1.5 px-3 has-[>svg]:px-2.5"
            )}
          >
            New list
          </Button>
          ;
        </div>
      </div>
      <SubsectionTabsCarousel subsectionTabs={subsectionTabs} />
    </div>
  );
};

export default MeListsSubheader;
