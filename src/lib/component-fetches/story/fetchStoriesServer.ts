import { StoryDraft } from "@/components/story/StoryDraftItem";
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

export const fetchUserStoriesOnServer = async (
  username: string,
  limit: number,
  page: number
): Promise<{
  stories: StoryItemStory[];
  hasNextPage: boolean;
  storiesCount: number;
  targetUserId: string;
}> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data, error: userIdError } = await supabase
      .from("service_users")
      .select("id")
      .eq("username", username)
      .single();
    if (userIdError || !data || !data.id) {
      console.error(userIdError);
      throw new Error("Failed to fetch user ID from provided username.");
    }

    const userId = data.id;
    const offset = (page - 1) * limit;

    const [storiesRes, storiesCountRes] = await Promise.all([
      supabase.rpc("get_user_stories_by_id", {
        target_user_id: userId,
        limit_param: limit + 1,
        offset_param: offset,
      }),
      supabase
        .from("stories")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .eq("visibility", "published"),
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
      hasNextPage,
      storiesCount: storiesCountRes.count || 0,
      targetUserId: userId,
    };
  } catch (error) {
    console.error(error);
    return {
      stories: [],
      hasNextPage: false,
      storiesCount: 0,
      targetUserId: "",
    };
  }
};

export const fetchActiveUserDraftsOnServer = async (
  userId: string,
  limit: number,
  page: number
): Promise<{
  drafts: StoryDraft[];
  hasNextPage: boolean;
  draftsCount: number;
}> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const offset = (page - 1) * limit;

    const [draftsRes, draftsCountRes] = await Promise.all([
      supabase.rpc("get_active_user_draft_stories", {
        limit_param: limit,
        offset_param: offset,
      }),
      supabase
        .from("stories")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("visibility", "draft"),
    ]);

    if (draftsRes.error || !draftsRes.data) {
      console.error(draftsRes.error);
      throw new Error("Failed to fetch drafts.");
    }
    if (draftsCountRes.error) {
      console.error(draftsCountRes.error);
      throw new Error("Failed to fetch drafts count.");
    }

    const hasNextPage = draftsRes.data.length > limit;

    return {
      drafts: draftsRes.data.slice(0, limit),
      hasNextPage,
      draftsCount: draftsCountRes.count || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      drafts: [],
      hasNextPage: false,
      draftsCount: 0,
    };
  }
};

export const fetchDraftByIdOnServer = async (
  draftId: string
): Promise<StoryDraft | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data: draft, error: draftError } = await supabase
      .from("stories")
      .select(
        "id, user_id, title, description, created_at, updated_at, json_content, words_count"
      )
      .eq("id", draftId)
      .single();
    if (draftError || !draft) {
      console.error(draftError);
      throw new Error("Failed to fetch draft.");
    }

    return draft;
  } catch (error) {
    console.error(error);
    return null;
  }
};
