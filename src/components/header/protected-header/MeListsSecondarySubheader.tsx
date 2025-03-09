import SubsectionTabsCarousel from "@/components/carousel/SubsectionTabsCarousel";
import { meListSubsectionTabs } from "./MeListsPrimarySubheader";

const MeListsSecondarySubheader = () => {
  return (
    <div className="w-auto mt-6 mb-6 tablet:mt-[52px] tablet:mb-6 px-6">
      <div className="mb-6 tablet:mb-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="font-medium tablet:text-4xl text-2xl">Your library</h2>
        </div>
      </div>
      <SubsectionTabsCarousel subsectionTabs={meListSubsectionTabs} />
    </div>
  );
};

export default MeListsSecondarySubheader;
