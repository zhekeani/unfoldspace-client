import { StoryItemStory } from "@/components/story/StoryItem";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

export const fetchStoriesByTopicOnServer = async (
  topic: string | undefined,
  limit: number,
  page: number // Page number instead of cursor
): Promise<{
  stories: StoryItemStory[];
  activeUserId: string;
  hasNextPage: boolean;
}> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const activeUserRes = await supabase.rpc("get_active_service_user_id");
    if (activeUserRes.error || !activeUserRes.data) {
      console.error(activeUserRes.error);
      throw new Error("Failed to fetch active service user ID.");
    }

    const activeServiceUserId = activeUserRes.data;
    const offset = (page - 1) * limit;

    const { data: stories, error } = await supabase.rpc(
      "get_stories_by_topic",
      {
        topic_name: topic,
        limit_param: limit + 1,
        offset_param: offset,
      }
    );

    if (error || !stories) {
      throw new Error("Failed to fetch stories.");
    }

    const hasNextPage = stories.length > limit;

    return {
      stories: stories.slice(0, limit),
      activeUserId: activeServiceUserId,
      hasNextPage,
    };
  } catch (error) {
    console.error(error);
    return { stories: [], activeUserId: "", hasNextPage: false };
  }
};
