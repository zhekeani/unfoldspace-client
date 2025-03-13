import { deleteResponse } from "@/actions/response/deleteResponse";
import { updateResponseClap } from "@/actions/response/updateResponseClap";
import ResponseEditorContainer from "@/components/containers/ResponseEditorContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  fetchResponse,
  fetchResponseReplies,
} from "@/lib/component-fetches/response/fetchResponseClient";
import { timeAgo } from "@/lib/story/calculateReadTime";
import { cn } from "@/lib/utils";
import {
  ExtendedListResponse,
  ExtendedStoryResponse,
  StoryResponse,
} from "@/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/react";
import { ChevronRight, Ellipsis, MessageCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ResponseActionsPopover from "./popovers/ResponseActionsPopover";

export type ExtendedResponse<
  T extends ExtendedStoryResponse | ExtendedListResponse,
> = T;

type ResponseItemProps<T extends ExtendedStoryResponse | ExtendedListResponse> =
  {
    entityQueryKey: string[];
    responsesQueryKey: string[];
    parentQueryKey?: string[];
    responseType?: "story" | "list";
    response: ExtendedResponse<T>;
    ownerId: string;
    activeUserId: string;
    responseLevel?: number;
    replyOpen?: boolean;
    openReplyOnSheet: (responseId: string) => void;
  };

const ResponseItem = <T extends ExtendedStoryResponse | ExtendedListResponse>({
  ownerId,
  entityQueryKey,
  responsesQueryKey,
  parentQueryKey,
  response: initialResponse,
  activeUserId,
  responseType = "story",
  responseLevel = 0,
  replyOpen: initialReplyOpen = false,
  openReplyOnSheet,
}: ResponseItemProps<T>) => {
  const [isReplyOpen, setIsReplyOpen] = useState(initialReplyOpen);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const queryClient = useQueryClient();

  const responseQueryKey = ["response", initialResponse.id];
  const repliesQueryKey = ["replies", initialResponse.id];

  const isStoryRes = responseType === "story";

  const { data: responseData, error: responseError } = useQuery({
    queryKey: responseQueryKey,
    queryFn: () => fetchResponse<T>(initialResponse.id, responseType),
    initialData: initialResponse,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const response = responseData as ExtendedStoryResponse | ExtendedListResponse;

  const { data: repliesData, error } = useQuery({
    queryKey: repliesQueryKey,
    queryFn: () => fetchResponseReplies(initialResponse.id, responseType),
    enabled: isReplyOpen,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: clapMutation, isPending: isClapping } = useMutation({
    mutationFn: async (newClapState: "add" | "remove") =>
      updateResponseClap(initialResponse.id, newClapState, responseType),

    onMutate: async (newClapState) => {
      queryClient.setQueryData(responseQueryKey, (oldData: StoryResponse) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          has_clapped: newClapState === "add",
          claps_count:
            newClapState === "add"
              ? oldData.claps_count || 0 + 1
              : oldData.claps_count || 0 - 1,
        };
      });
    },

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: responseQueryKey });
    },
  });

  const onClap = () => {
    const newClapState = response.has_clapped ? "remove" : "add";
    clapMutation(newClapState);
  };

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => deleteResponse(response.id, responseType),

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        const isResponseReply = !!res.data.parentId;
        if (isResponseReply) {
          if (parentQueryKey) {
            queryClient.invalidateQueries({
              queryKey: parentQueryKey,
            });
          }
        } else {
          queryClient.invalidateQueries({
            queryKey: entityQueryKey,
          });
        }
        queryClient.invalidateQueries({
          queryKey: responsesQueryKey,
        });
      }
    },
  });

  const toggleReply = () => {
    if (response.total_replies && response.total_replies > 0) {
      setIsReplyOpen((prev) => {
        if (prev) {
          setIsInputOpen(false);
        }
        return !prev;
      });
    }
  };

  const toggleInput = () => {
    setIsInputOpen((prev) => {
      if (!prev) {
        setIsReplyOpen(true);
      }
      return !prev;
    });
  };

  const onSuccessAddReplyCb = () => {
    queryClient.invalidateQueries({ queryKey: responseQueryKey });
    queryClient.invalidateQueries({ queryKey: repliesQueryKey });
  };
  const onSuccessUpdateCb = () => {
    queryClient.invalidateQueries({ queryKey: responseQueryKey });
    setIsEditorOpen(false);
  };

  if (error || responseError) {
    console.error(error);

    return <p>Error loading replies</p>;
  }

  const replies = repliesData || [];
  const isAuthor = activeUserId === ownerId;
  const isEdited = !!response.edited_at;

  return (
    <div className="response-editor w-full pt-[25px] pb-[16px] flex flex-col border-b-[1px] border-b-gray-200 gap-2">
      {!isEditorOpen && (
        <div className="flex flex-col">
          <div className="w-full flex justify-between items-center">
            <div className="flex ">
              <Link href={`/%40${response.author_username}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    className="w-full h-full object-cover"
                    src={response.author_profile_picture || ""}
                  />
                  <AvatarFallback>
                    {response.author_username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col ml-3">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/%40${response.author_username}`}
                    className="text-sm text-main-text hover:underline"
                  >
                    {response.author_name}
                  </Link>
                  {isAuthor && (
                    <div className="px-[4px] py-[2px] bg-main-green rounded-sm flex items-center">
                      <p className="text-[11px] leading-none text-white">
                        Author
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-sub-text">
                  {timeAgo(response.updated_at || response.created_at)}{" "}
                  {isEdited && <span>(edited)</span>}
                </p>
              </div>
            </div>

            <ResponseActionsPopover
              isEditorOpen={isEditorOpen}
              setIsEditorOpen={setIsEditorOpen}
              responseId={response.id}
              handleDelete={deleteMutation}
              isDeleting={isDeleting}
              isAuthor={response.user_id === activeUserId}
            >
              <Button variant={"ghost"} size={"icon"}>
                <Ellipsis className="!w-5 !h-5 stroke-sub-text fill-sub-text" />
              </Button>
            </ResponseActionsPopover>
          </div>

          <div className="mt-[14px]">
            <div
              className="response-editor ProseMirror text-sm "
              dangerouslySetInnerHTML={{ __html: response.html_content }}
            />
          </div>

          <div className="mt-[14px] h-[18px] flex gap-6 items-center">
            <Button
              disabled={isClapping}
              onClick={onClap}
              variant={"ghost"}
              size={"sm"}
              className="!text-sub-text h-full hover:!text-main-text text-xs-sm !p-0 hover:bg-transparent"
            >
              <div className="flex h-full items-center gap-2">
                <ThumbsUp
                  className={cn(
                    "!w-[18px] !h-[18px]",
                    response.has_clapped
                      ? "fill-sub-text hover:fill-main-text"
                      : "fill-transparent"
                  )}
                  strokeWidth={response.has_clapped ? 0 : 1.5}
                />
                <div className="flex ">
                  <p className="  font-light   text-main-text text-xs-sm">
                    {response.claps_count}
                  </p>
                </div>
              </div>
            </Button>

            {responseLevel < 2 && (
              <>
                {response.total_replies! > 0 && (
                  <Button
                    onClick={toggleReply}
                    variant={"ghost"}
                    size={"sm"}
                    className="text-sub-text !p-0 hover:bg-transparent"
                  >
                    <div className="flex items-end gap-2">
                      <MessageCircle
                        className="!w-[18px] !h-[18px]"
                        strokeWidth={1.5}
                      />
                      <div className="font-normal text-xs-sm">
                        {!isReplyOpen && (
                          <>
                            {response.total_replies}{" "}
                            {response.total_replies === 1 && <span>reply</span>}{" "}
                            {response.total_replies! > 1 && (
                              <span>replies</span>
                            )}
                          </>
                        )}
                        {isReplyOpen && <p>Hide replies</p>}
                      </div>
                    </div>
                  </Button>
                )}
                <Button
                  onClick={toggleInput}
                  variant={"ghost"}
                  size={"sm"}
                  className="underline text-xs-sm !p-0 hover:bg-transparent font-normal"
                >
                  Reply
                </Button>
              </>
            )}

            {responseLevel >= 2 && (
              <>
                {response.total_replies! > 0 && (
                  <Button
                    onClick={() => openReplyOnSheet(response.id)}
                    variant={"ghost"}
                    size={"sm"}
                    className="text-sub-text !p-0 hover:bg-transparent"
                  >
                    <div className="flex items-end gap-2">
                      <MessageCircle
                        className="!w-[18px] !h-[18px]"
                        strokeWidth={1.5}
                      />

                      <div className="font-normal text-xs-sm">More replies</div>
                      <ChevronRight
                        className="!w-[18px] !h-[18px]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </Button>
                )}
                <Button
                  onClick={() => openReplyOnSheet(response.id)}
                  variant={"ghost"}
                  size={"sm"}
                  className="underline text-xs-sm !p-0 hover:bg-transparent font-normal"
                >
                  Expand
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      {isEditorOpen && (
        <ResponseEditorContainer
          responseType={responseType}
          actionType="update"
          responseId={response.id}
          initialFocus={true}
          entityId={
            isStoryRes
              ? (response as ExtendedStoryResponse).story_id
              : (response as ExtendedListResponse).reading_list_id
          }
          parentId={response.id}
          initialContent={response.json_content as JSONContent}
          onCloseCb={() => setIsEditorOpen(false)}
          onSuccessCb={() => onSuccessUpdateCb()}
        />
      )}
      {((replies.length > 0 && isReplyOpen) || isInputOpen) && (
        <div className="ml-[12px] mb-[24px] border-l-[3px] border-l-complement-light-gray pl-[24px] flex flex-col">
          {isInputOpen && (
            <ResponseEditorContainer
              responseType={responseType}
              entityId={
                isStoryRes
                  ? (response as ExtendedStoryResponse).story_id
                  : (response as ExtendedListResponse).reading_list_id
              }
              parentId={response.id}
              initialFocus={true}
              onSuccessCb={() => onSuccessAddReplyCb()}
              onCloseCb={() => setIsInputOpen(false)}
            />
          )}
          {replies.length > 0 &&
            replies.map((reply) => (
              <ResponseItem
                ownerId={ownerId}
                responseType={responseType}
                responsesQueryKey={repliesQueryKey}
                entityQueryKey={entityQueryKey}
                openReplyOnSheet={openReplyOnSheet}
                key={reply.id}
                response={reply}
                activeUserId={activeUserId}
                responseLevel={responseLevel + 1}
                parentQueryKey={responseQueryKey}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ResponseItem;
