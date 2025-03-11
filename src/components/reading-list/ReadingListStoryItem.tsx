import { useReadingListDetail } from "@/components/context/ReadingListDetailContext";
import StoryItem from "@/components/story/StoryItem";
import { fetchListItemByIdOnClient } from "@/lib/component-fetches/reading-list-item/fetchReadingListItemsClient";
import { Database } from "@/types/supabase.types";
import { useQuery } from "@tanstack/react-query";
import ReadingListStoryNote from "./components/ReadingListStoryNote";

export type ExtendedReadingListItem =
  Database["public"]["Functions"]["get_reading_list_items_by_list_id"]["Returns"][number];

type ReadingListStoryItemProps = {
  listItem: ExtendedReadingListItem;
  isOwned: boolean;
  activeUserId: string;
};

const ReadingListStoryItem = ({
  isOwned,
  listItem: initialListItem,
  activeUserId,
}: ReadingListStoryItemProps) => {
  const { listDetailQueryKey, listItemsQueryKey } = useReadingListDetail();
  const listItemQueryKey = ["reading_list_item", initialListItem.id];

  const { data: listItemData, error: listItemError } = useQuery({
    queryKey: listItemQueryKey,
    queryFn: () => fetchListItemByIdOnClient(initialListItem.id),
    initialData: { listItem: initialListItem },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (listItemError || !listItemData || !listItemData.listItem) {
    console.error(listItemError);
    return null;
  }

  const { listItem } = listItemData;

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    item_order,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    created_at,
    note,
    story_id,
    story_created_at,
    story_updated_at,
    ...story
  } = listItem;

  return (
    <div>
      <div className="mx-6">
        <ReadingListStoryNote
          isOwned={isOwned}
          note={note || ""}
          listItemId={listItem.id}
          listItemQueryKey={listItemQueryKey}
        />
      </div>
      <StoryItem
        initialStory={{
          id: story_id,
          created_at: story_created_at,
          updated_at: story_updated_at,
          ...story,
        }}
        storiesQueryKey={listItemsQueryKey}
        activeUserId={activeUserId}
        isOwned={activeUserId === story.user_id}
        itemType="list-item"
        listId={listItem.reading_list_id}
        listItemId={listItem.id}
        listDetailQueryKey={listDetailQueryKey}
        listItemsQueryKey={listItemsQueryKey}
      />
    </div>
  );
};

export default ReadingListStoryItem;
