import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { StoryDetail } from "@/types/database.types";

export const fetchStoryDetailByIdOnClient = async (
  storyId: string
): Promise<StoryDetail | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data, error } = await supabase.rpc("get_story_detail", {
      story_id_param: storyId,
    });

    if (error || !data || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch story detail");
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
