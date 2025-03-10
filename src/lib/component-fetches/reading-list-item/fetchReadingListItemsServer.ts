"use server";

import { ExtendedReadingListItem } from "@/components/reading-list/ReadingListStoryItem";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

export const fetchListItemsByListIdOnServer = async (
  listId: string,
  limit: number,
  page: number
): Promise<{
  listItems: ExtendedReadingListItem[];
  hasNextPage: boolean;
  listItemsCount: number;
} | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
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
