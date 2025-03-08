import { StoryItemStory } from "@/components/story/StoryItem";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";

export const fetchStoryByIdOnClient = async (
  storyId: string
): Promise<StoryItemStory | null> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc("get_story_by_id", {
      story_id: storyId,
    });
    if (error || !data || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch story.");
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchActiveUserLastSavedStoriesOnClient = async () => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc(
      "get_active_user_last_saved_stories"
    );
    if (error || !data || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch stories.");
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
