import { ExtendedReadingListItem } from "@/components/reading-list/ReadingListStoryItem";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";

export const fetchListItemsByListIdOnClient = async (
  listId: string,
  limit: number,
  page: number
): Promise<{
  listItems: ExtendedReadingListItem[];
  hasNextPage: boolean;
  listItemsCount: number;
} | null> => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }
    const offset = (page - 1) * limit;

    const [listItemsRes, countRes] = await Promise.all([
      supabase.rpc("get_reading_list_items_by_list_id", {
        list_id: listId,
        limit_param: limit + 1,
        offset_param: offset,
      }),
      supabase
        .from("reading_list_items")
        .select("*", { count: "exact", head: true })
        .eq("reading_list_id", listId),
    ]);

    if (listItemsRes.error) {
      console.error(listItemsRes.error);
      throw new Error("Failed to fetch reading list items.");
    }
    if (countRes.error) {
      console.error(countRes.error);
      throw new Error("Failed to fetch reading list items count.");
    }

    const hasNextPage = listItemsRes.data.length > limit;

    return {
      listItems: listItemsRes.data.slice(0, limit),
      hasNextPage,
      listItemsCount: countRes.count || 0,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchListItemByIdOnClient = async (
  listItemId: string
): Promise<{ listItem: ExtendedReadingListItem } | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data, error } = await supabase.rpc("get_reading_list_item_by_id", {
      list_item_id: listItemId,
    });
    if (error || !data || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch reading list item.");
    }

    return {
      listItem: data[0],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
