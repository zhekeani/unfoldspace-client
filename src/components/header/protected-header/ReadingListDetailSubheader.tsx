import { useQuery } from "@tanstack/react-query";
import { Dot, Key } from "lucide-react";
import { fetchReadingListDetailByIdOnClient } from "../../../lib/component-fetches/reading-list/fetchReadingListsClient";
import convertIsoDate from "../../../lib/story/convertIsoDate";
import { ReadingListDetail } from "../../../types/database.types";
import { useReadingListDetail } from "../../context/ReadingListDetailContext";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import ReadingListDetailActionsBar from "./components/ListDetailActionsBar";
import ListDetailReorderButton from "./components/ListDetailReorderButton";

type ReadingListDetailSubheaderProps = {
  activeUserId: string;
  readingList: ReadingListDetail;
};

const ReadingListDetailSubheader = ({
  activeUserId,
  readingList: initialReadingList,
}: ReadingListDetailSubheaderProps) => {
  const { listDetailQueryKey, pageActionType } = useReadingListDetail();

  const { data: listDetailData, error: listDetailError } = useQuery({
    queryKey: listDetailQueryKey,
    queryFn: () => fetchReadingListDetailByIdOnClient(initialReadingList.id),
    initialData: { readingList: initialReadingList },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (listDetailError || !listDetailData?.readingList) {
    console.error(listDetailError);
    return null;
  }

  const { readingList } = listDetailData;
  const isNoAction = !pageActionType;
  const isReorderAction = pageActionType === "reorder";

  return (
    <div>
      <div className="mx-6">
        <header className="h-12 mt-4 mb-8 flex w-full justify-between items-center">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                className="w-full h-full object-cover"
                src={readingList.owner_profile_picture}
              />
              <AvatarFallback>
                {readingList.owner_username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="h-full flex flex-col justify-between">
              <h4>{readingList.owner_username}</h4>
              <div className="flex items-center gap-2">
                <p className="flex items-center text-gray-500 text-sm">
                  {convertIsoDate(readingList.created_at)}
                  <span>
                    <Dot size={16} strokeWidth={2} />
                  </span>{" "}
                  {readingList.stories_count} stories
                </p>
                {readingList.visibility === "private" && (
                  <Key strokeWidth={2} className="stroke-sub-text w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {isReorderAction && (
            <ListDetailReorderButton listId={readingList.id} />
          )}
        </header>
      </div>
      <div className="mx-6">
        <div className="pb-6">
          <h2 className="text-3xl font-medium">{readingList.title}</h2>
          {readingList.description && (
            <div className="pt-2">
              <p className="text-sub-text text-base">
                {readingList.description}
              </p>
            </div>
          )}
        </div>

        {isNoAction && (
          <ReadingListDetailActionsBar
            activeUserId={activeUserId}
            readingList={readingList}
            collapsible={true}
          />
        )}
      </div>
    </div>
  );
};

export default ReadingListDetailSubheader;
