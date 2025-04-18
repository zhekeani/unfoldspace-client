import { useStoryEditor } from "@/components/context/StoryEditorContext";
import StoryPublicationDialog from "@/components/story/dialogs/StoryPublicationDialog";
import EditorActionsPopover from "@/components/story/popovers/EditorActionsPopover";
import { Button } from "@/components/ui/button";
import { ServiceUser, Story } from "@/types/database.types";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Ellipsis } from "lucide-react";
import Link from "next/link";
import HeaderUserDropdown from "../protected-header/components/UserDropdown";

type EditorHeaderProps = {
  activeUser: ServiceUser;
};

const EditorHeader = ({ activeUser }: EditorHeaderProps) => {
  const { savedStatus } = useStoryEditor();
  const queryClient = useQueryClient();
  const { storyQueryKey } = useStoryEditor();
  const story = queryClient.getQueryData<Story | null>(storyQueryKey);

  return (
    <header className="fixed top-0 w-full flex flex-shrink-0 h-[57px] px-6  bg-white z-20 ">
      <nav className="w-full max-w-[1032px] mx-auto h-full flex justify-between items-center">
        <div className="h-full flex items-center gap-3">
          <Link
            href={"/home"}
            className="font-gt-super text-3xl font-medium tracking-tighter"
          >
            UnfoldSpace
          </Link>
          <div className="flex gap-3 pt-[8px] text-xs-sm">
            <div>
              <p className="text-main-text">Draft in {activeUser.username}</p>
            </div>
            <div>
              <p className="text-gray-500">
                {savedStatus !== "saving" ? savedStatus : "saving..."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-full items-center gap-3">
          <StoryPublicationDialog>
            <Button
              disabled={!story}
              type="button"
              className="h-fit !px-3 py-[6px] rounded-full bg-main-green"
            >
              <span className="text-xs font-light">Publish</span>
            </Button>
          </StoryPublicationDialog>

          <EditorActionsPopover>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Ellipsis className="text-sub-text !w-5 !h-5" />
            </Button>
          </EditorActionsPopover>

          <Button size="icon" variant="ghost">
            <Bell strokeWidth={1.5} className="text-sub-text !w-5 !h-5" />
          </Button>
          <HeaderUserDropdown serviceUser={activeUser} />
        </div>
      </nav>
    </header>
  );
};

export default EditorHeader;
