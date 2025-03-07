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
