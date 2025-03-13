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

// export const fetchStoryByIdOnClient = async (
//   storyId: string
// ): Promise<Story | null> => {
//   try {
//     const supabase = getSupabaseBrowserClient();
//     if (!supabase) {
//       throw new Error("Database client unavailable.");
//     }

//     const { data: story, error: storyError } = await supabase
//       .from("stories")
//       .select("*")
//       .eq("id", storyId)
//       .maybeSingle();
//     if (storyError || !story) {
//       console.error(storyError);
//       throw new Error("Failed to fetch story.");
//     }

//     return story;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
