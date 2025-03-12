import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { StoryDetail, Topic } from "@/types/database.types";

export const fetchStoryDetailByIdOnClient = async (
  storyId: string
): Promise<{ story: StoryDetail; topics: Topic[] } | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const [storyDetailRes, topicsRes] = await Promise.all([
      supabase.rpc("get_story_detail", {
        story_id_param: storyId,
      }),
      supabase.rpc("get_topics_by_story", { p_story_id: storyId }),
    ]);

    if (
      storyDetailRes.error ||
      !storyDetailRes.data ||
      storyDetailRes.data.length === 0
    ) {
      console.error(storyDetailRes.error);
      throw new Error("Failed to fetch story detail");
    }

    if (topicsRes.error) {
      console.error(topicsRes.error);
      throw new Error("Failed to fetch story's topis");
    }

    return {
      story: storyDetailRes.data[0],
      topics: topicsRes.data || [],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
