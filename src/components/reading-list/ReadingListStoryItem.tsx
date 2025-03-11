/* eslint-disable @typescript-eslint/no-unused-vars */
import { useReadingListDetail } from "@/components/context/ReadingListDetailContext";
import StoryItem from "@/components/story/StoryItem";
import { Database } from "@/types/supabase.types";
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
  listItem,
  activeUserId,
}: ReadingListStoryItemProps) => {
  const { listDetailQueryKey, listItemsQueryKey } = useReadingListDetail();
  const listItemQueryKey = ["reading_list_item", listItem.id];

  const {
    id,
    item_order,
    note,
    created_at,
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
          storyId={listItem.story_id}
          note={note || ""}
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
