import { useReadingListDetail } from "@/components/context/ReadingListDetailContext";
import { Spinner } from "@/components/loading/Spinner";
import ResponseItem from "@/components/response/ResponseItem";
import { Button } from "@/components/ui/button";
import {
  RightBottomSheetContent,
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fetchListResponses } from "@/lib/component-fetches/response/fetchResponseClient";
import {
  ExtendedListResponse,
  ReadingListDetail,
  ServiceUser,
} from "@/types/database.types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import ResponseEditorContainer from "./ResponseEditorContainer";

type ResponsesContainerProps = {
  listId: string;
  activeUser: ServiceUser;
  ownerId: string;
};

const ListDetailResponsesContainer = ({
  listId,
  activeUser,
  ownerId,
}: ResponsesContainerProps) => {
  const [replyStack, setReplyStack] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const {
    listDetailQueryKey,
    isResSheetOpen,
    setResSheetOpen,
    responsesQueryKey,
  } = useReadingListDetail();

  const listData = queryClient.getQueryData<{ readingList: ReadingListDetail }>(
    listDetailQueryKey
  );

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
      fetchListResponses(listId, 5, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });

  const openReplyOnSheet = (responseId: string) => {
    setReplyStack((prev) => [...prev, responseId]);
    setResSheetOpen(true);
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: responsesQueryKey });
  }, [responsesQueryKey, queryClient, listId]);

  if (!listData) return null;
  if (error) return <p>Error loading responses</p>;

  const response =
    replyStack.length > 0
      ? queryClient.getQueryData<ExtendedListResponse>([
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
      setResSheetOpen(false);
    }
  };

  return (
    <Sheet open={isResSheetOpen} onOpenChange={setResSheetOpen}>
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
          {isLoading && (
            <div className="w-full my-16 flex justify-center">
              <Spinner />
            </div>
          )}
          {!isLoading && response && (
            <ResponseItem
              openReplyOnSheet={openReplyOnSheet}
              response={response}
              activeUserId={activeUser.id}
              replyOpen={true}
              entityQueryKey={listDetailQueryKey}
              responsesQueryKey={responsesQueryKey}
              responseType="list"
              ownerId={ownerId}
            />
          )}
          {!isLoading && !response && (
            <div>
              <div>
                <div className="mt-6 pb-8 border-b-[1px] border-b-gray-200">
                  <ResponseEditorContainer
                    responseType="list"
                    initialFocus={true}
                    entityId={listId}
                    onSuccessCb={() => {
                      queryClient.invalidateQueries({
                        queryKey: listDetailQueryKey,
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
                      activeUserId={activeUser.id}
                      entityQueryKey={listDetailQueryKey}
                      responsesQueryKey={responsesQueryKey}
                      responseType="list"
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
                  className="mb-6 mt-10 font-normal rounded-full text-main-text text-xs"
                >
                  Previous
                </Button>
              )}
            </div>
          )}
        </div>
      </RightBottomSheetContent>
    </Sheet>
  );
};

export default ListDetailResponsesContainer;
