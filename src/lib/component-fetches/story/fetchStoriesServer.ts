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
  storiesCount: number;
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

    let topicId: string | undefined;
    if (topic) {
      const { data: topicIdData, error: topicIdError } = await supabase
        .from("topics")
        .select("id")
        .eq("name", topic)
        .maybeSingle();
      if (topicIdError) {
        console.error(topicIdError);
        throw new Error("Failed to fetch topic ID.");
      }
      topicId = topicIdData ? topicIdData.id : undefined;
    }

    const countQuery = supabase
      .from("stories")
      .select("*", { count: "exact" })
      .eq("visibility", "published");

    if (topic) {
      if (!topicId) {
        return {
          stories: [],
          activeUserId: activeServiceUserId,
          hasNextPage: false,
          storiesCount: 0,
        };
      } else {
        countQuery.contains("topic_ids", JSON.stringify([topicId]));
      }
    }

    const [storiesRes, storiesCountRes] = await Promise.all([
      supabase.rpc("get_stories_by_topic", {
        topic_name: topic,
        limit_param: limit + 1,
        offset_param: offset,
      }),
      countQuery,
    ]);

    if (storiesRes.error || !storiesRes.data) {
      console.error(storiesRes.error);
      throw new Error("Failed to fetch stories.");
    }
    if (storiesCountRes.error) {
      console.error(storiesCountRes.error);
      throw new Error("Failed to fetch stories count.");
    }

    const hasNextPage = storiesRes.data.length > limit;

    return {
      stories: storiesRes.data.slice(0, limit),
      activeUserId: activeServiceUserId,
      hasNextPage,
      storiesCount: storiesCountRes.count || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      stories: [],
      activeUserId: "",
      hasNextPage: false,
      storiesCount: 0,
    };
  }
};
