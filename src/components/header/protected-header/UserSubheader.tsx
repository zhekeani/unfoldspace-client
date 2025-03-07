import SubsectionTabsCarousel, {
  SubsectionTab,
} from "@/components/carousel/SubsectionTabsCarousel";
import { Button } from "@/components/ui/button";
import { ServiceUser } from "@/types/database.types";
import { Ellipsis } from "lucide-react";

type UserSubheaderProps = {
  user: ServiceUser;
  activeUserId: string;
  subsectionTabs: SubsectionTab[];
};

const UserSubheader = ({ user, subsectionTabs }: UserSubheaderProps) => {
  return (
    <div className="w-full desktop:w-auto mt-6 mb-6 desktop:mt-[52px] tablet:mb-6 px-6">
      <div className="hidden mb-6 tablet:mb-10 desktop:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="font-medium text-4xl">
            {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
          </h2>
        </div>

        <div>
          <Button variant="ghost">
            <Ellipsis />
          </Button>
        </div>
      </div>
      <SubsectionTabsCarousel subsectionTabs={subsectionTabs} />
    </div>
  );
};

export default UserSubheader;
