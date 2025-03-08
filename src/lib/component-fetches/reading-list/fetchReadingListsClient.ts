import { ExtendedReadingList } from "@/components/reading-list/ReadingListItem";
import { StoryBookmarkPopoverReadingList } from "@/components/story/components/StoryBookmarkPopover";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";

export const fetchReadingListWSavedOnClient = async (
  storyId: string
): Promise<StoryBookmarkPopoverReadingList[] | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data: readingListsWSaved, error: readingListWSavedError } =
      await supabase.rpc("get_user_reading_lists_with_saved_status", {
        story_id_param: storyId,
      });

    if (readingListWSavedError) {
      console.error(readingListWSavedError);
      throw new Error("Failed to fetch current user's reading lists.");
    }

    return readingListsWSaved;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchReadingListDetailOnClient = async (
  readingListId: string
): Promise<ExtendedReadingList | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc("get_reading_list_detail", {
      list_id_param: readingListId,
    });
    if (error || !data || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch reading list detail.");
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserDetailedReadingListsByIdOnClient = async (
  userId: string,
  limit: number,
  page: number
): Promise<{
  readingLists: ExtendedReadingList[];
  hasNextPage: boolean;
  readingListsCount: number;
} | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }
    const offset = (page - 1) * limit;

    const [readingListRes, countRes] = await Promise.all([
      supabase.rpc("get_user_reading_lists_by_id", {
        target_user_id: userId,
        limit_param: limit + 1,
        offset_param: offset,
      }),
      supabase
        .from("reading_lists")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    if (readingListRes.error) {
      console.error(readingListRes.error);
      throw new Error("Failed to fetch user reading lists.");
    }
    if (countRes.error) {
      console.error(countRes.error);
      throw new Error("Failed to fetch reading list count.");
    }

    const hasNextPage = readingListRes.data.length > limit;

    return {
      readingLists: readingListRes.data,
      hasNextPage,
      readingListsCount: countRes.count || 0,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
