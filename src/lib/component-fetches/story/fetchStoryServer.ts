"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { StoryDetail, Topic } from "@/types/database.types";

export const fetchStoryDetailByIdOnServer = async (
  storyId: string
): Promise<StoryDetail | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
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

export const fetchTopicsByStoryOnServer = async (
  storyId: string
): Promise<{ topics: Topic[] } | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data, error } = await supabase.rpc("get_topics_by_story", {
      p_story_id: storyId,
    });

    if (error || !data) {
      console.error(error);
      throw new Error("Failed to fetch story's topis");
    }

    return {
      topics: data || [],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
