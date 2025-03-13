import ResponseEditorContainer from "@/components/containers/ResponseEditorContainer";
import { useStoryDetail } from "@/components/context/StoryDetailContext";
import { Spinner } from "@/components/loading/Spinner";
import { Button } from "@/components/ui/button";
import {
  RightBottomSheetContent,
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ExtendedStoryResponse } from "@/types/database.types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import ResponseItem from "../ResponseItem";

type RepliesSheetProps = {
  storyId: string;
  ownerId: string;
  responses:
    | InfiniteData<
        {
          responses: ExtendedStoryResponse[];
          nextCursor: string | null;
        },
        unknown
      >
    | undefined;
  replyStack: string[];
  setReplyStack: Dispatch<SetStateAction<string[]>>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  activeUserId: string;
  openReplyOnSheet: (responseId: string) => void;
  isRefetching: boolean;
};

const StoryRepliesSheet = ({
  storyId,
  ownerId,
  responses,
  replyStack,
  setReplyStack,
  activeUserId,
  openReplyOnSheet,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isRefetching,
}: RepliesSheetProps) => {
  const queryClient = useQueryClient();
  const {
    storyDetailQueryKey,
    responsesQueryKey,
    isResSheetOpen: isOpen,
    setResSheetOpen: setIsOpen,
  } = useStoryDetail();

  const response =
    replyStack.length > 0
      ? queryClient.getQueryData<ExtendedStoryResponse>([
          "response",
          replyStack[replyStack.length - 1],
        ])
      : null;

  const handleBack = () => {
    if (replyStack.length > 0) {
      setReplyStack((prev) => {
        if (prev.length === 0) return prev;

        return prev.slice(0, -1);
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <RightBottomSheetContent className=" overflow-y-scroll">
        <SheetHeader className="px-0">
          <div className="flex items-center gap-2">
            <Button
              className="!p-0 !w-fit"
              onClick={handleBack}
              size={"icon"}
              variant={"ghost"}
            >
              <ChevronLeft className="!w-6 !h-6 stroke-main-text" />
            </Button>
            <SheetTitle className="font-medium">Replies</SheetTitle>
          </div>
          <SheetDescription>Replies detailed view</SheetDescription>
        </SheetHeader>

        <div>
          {}
          {response && (
            <ResponseItem
              openReplyOnSheet={openReplyOnSheet}
              response={response}
              activeUserId={activeUserId}
              replyOpen={true}
              entityQueryKey={storyDetailQueryKey}
              responsesQueryKey={responsesQueryKey}
              responseType="story"
              ownerId={ownerId}
            />
          )}
          {!response && (
            <div>
              <div>
                <div className="mt-6 pb-8 border-b-[1px] border-b-gray-200">
                  <ResponseEditorContainer
                    responseType="story"
                    initialFocus={true}
                    entityId={storyId}
                    onSuccessCb={() => {
                      queryClient.invalidateQueries({
                        queryKey: storyDetailQueryKey,
                      });
                      queryClient.invalidateQueries({
                        queryKey: responsesQueryKey,
                      });
                    }}
                  />
                </div>
              </div>
              {isRefetching && (
                <div className="w-full my-8 flex justify-center">
                  <Spinner />
                </div>
              )}
              <div>
                {responses?.pages.flatMap((page) =>
                  page.responses.map((response) => (
                    <ResponseItem
                      openReplyOnSheet={openReplyOnSheet}
                      key={response.id}
                      response={response}
                      activeUserId={activeUserId}
                      entityQueryKey={storyDetailQueryKey}
                      responsesQueryKey={responsesQueryKey}
                      responseType="story"
                      ownerId={ownerId}
                    />
                  ))
                )}
              </div>

              {isFetchingNextPage && (
                <div className=" my-6 w-full flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              {!isFetchingNextPage && hasNextPage && (
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant={"outline"}
                  size={"sm"}
                  className="mb-6 mt-10 font-normal rounded-full text-main-text text-sm"
                >
                  Previous responses
                </Button>
              )}
            </div>
          )}
        </div>
      </RightBottomSheetContent>
    </Sheet>
  );
};

export default StoryRepliesSheet;
