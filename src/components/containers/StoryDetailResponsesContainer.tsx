import { useStoryDetail } from "@/components/context/StoryDetailContext";
import { Spinner } from "@/components/loading/Spinner";
import StoryRepliesSheet from "@/components/response/components/StoryRepliesSheet";
import ResponseItem from "@/components/response/ResponseItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchStoryResponses } from "@/lib/component-fetches/response/fetchResponseClient";
import {
  ExtendedStoryResponse,
  ServiceUser,
  StoryDetail,
} from "@/types/database.types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import ResponseEditorContainer from "./ResponseEditorContainer";

type ResponsesContainerProps = {
  storyId: string;
  activeUser: ServiceUser;
};

const StoryDetailResponsesContainer = ({
  storyId,
  activeUser,
}: ResponsesContainerProps) => {
  const [responseIds, setResponseIds] = useState<string[]>([]);
  const [replyStact, setReplyStack] = useState<string[]>([]);
  const [topResponses, setTopResponses] = useState<ExtendedStoryResponse[]>([]);

  const queryClient = useQueryClient();
  const { storyDetailQueryKey, responsesQueryKey, setResSheetOpen } =
    useStoryDetail();

  const story = queryClient.getQueryData<StoryDetail>(storyDetailQueryKey);

  const {
    data: responses,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: responsesQueryKey,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchStoryResponses(storyId, 5, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });

  const openReplyOnSheet = (responseId: string) => {
    setReplyStack((prev) => [...prev, responseId]);
    setResSheetOpen(true);
  };

  useEffect(() => {
    setTopResponses(
      responses?.pages.flatMap((page) => page.responses).slice(0, 3) || []
    );
  }, [responses]);

  useEffect(() => {
    if (story?.recent_top_response_ids) {
      const recentTopResponseIds = (story?.recent_top_response_ids ||
        []) as string[];
      setResponseIds((prev) => {
        return [...recentTopResponseIds, ...prev];
      });
    }
  }, [story]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: responsesQueryKey });
  }, [queryClient, responseIds, responsesQueryKey, storyId]);

  if (!story) return null;
  if (error) return <p>Error loading responses</p>;

  console.log(responses);

  return (
    <>
      <StoryRepliesSheet
        replyStack={replyStact}
        setReplyStack={setReplyStack}
        storyId={story.id}
        ownerId={story.user_id}
        responses={responses}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        activeUserId={activeUser.id}
        openReplyOnSheet={openReplyOnSheet}
        isRefetching={isRefetching}
      />
      <div className="mb-6 mt-16 border-t-[1px] border-complement-light-gray">
        <div className="w-full h-16 flex-shrink-0" />

        <div className="flex justify-between">
          <h3 className="text-xl font-medium text-main-text">
            Responses ({story.responses_count})
          </h3>
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis className="!w-5 !h-5" />
          </Button>
        </div>

        <div className="mt-[40px] mb-[16px]">
          <div className="mb-[12px] flex gap-3 items-center">
            <Avatar className="w-8 h-8 ">
              <AvatarImage
                className="w-full h-full object-cover "
                src={activeUser.profile_picture || ""}
              />
              <AvatarFallback>
                {activeUser.username!.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h4 className="text-main-text text-sm">{activeUser.name}</h4>
          </div>

          <div className="pb-8 border-b-[1px] border-b-gray-200">
            <ResponseEditorContainer
              responseType={"story"}
              entityId={storyId}
              onSuccessCb={() => {
                queryClient.invalidateQueries({
                  queryKey: storyDetailQueryKey,
                });
                queryClient.invalidateQueries({ queryKey: responsesQueryKey });
              }}
            />
          </div>
          {isLoading && (
            <div className="w-full my-16 flex justify-center">
              <Spinner />
            </div>
          )}

          {!isLoading && (
            <>
              {isRefetching && (
                <div className="w-full mt-8 mb-2 flex justify-center">
                  <Spinner />
                </div>
              )}

              <div className="mt-6 mb-[16px]">
                {topResponses.map((response) => (
                  <ResponseItem<ExtendedStoryResponse>
                    responseType="story"
                    entityQueryKey={storyDetailQueryKey}
                    responsesQueryKey={responsesQueryKey}
                    openReplyOnSheet={openReplyOnSheet}
                    key={response.id}
                    response={response}
                    ownerId={story.user_id}
                    activeUserId={activeUser.id}
                  />
                ))}
              </div>

              {responses &&
                responses.pages.flatMap((page) => page.responses).length >
                  3 && (
                  <div className="mt-12">
                    <Button
                      onClick={() => setResSheetOpen(true)}
                      variant={"outline"}
                      className="rounded-full text-main-text font-normal"
                    >
                      See all response
                    </Button>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StoryDetailResponsesContainer;
