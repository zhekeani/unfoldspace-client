import SubsectionTabsCarousel, {
  SubsectionTab,
} from "@/components/carousel/SubsectionTabsCarousel";

const subsectionTabs: SubsectionTab[] = [
  {
    label: "Account",
    path: "/me/settings",
  },
  {
    label: "Publishing",
    path: "/me/settings/publishing",
  },
  {
    label: "Notifications",
    path: "/me/settings/notifications",
  },
  {
    label: "Security and apps",
    path: "/me/settings/security",
  },
];

const MeSettingsSubheader = () => {
  return (
    <div className="w-auto mt-6 mb-6 tablet:mt-[52px] tablet:mb-6 px-6">
      <div className="mb-6 tablet:mb-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="font-medium tablet:text-4xl text-2xl">Settings</h2>
        </div>
      </div>
      <SubsectionTabsCarousel subsectionTabs={subsectionTabs} />
    </div>
  );
};

export default MeSettingsSubheader;
