import { StoryDraft } from "@/components/story/StoryDraftItem";
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

export const fetchUserStoriesByIdOnClient = async (
  userId: string,
  limit: number,
  page: number
): Promise<{
  stories: StoryItemStory[];
  hasNextPage: boolean;
  storiesCount: number;
}> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }
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
    };
  } catch (error) {
    console.error(error);
    return {
      stories: [],
      hasNextPage: false,
      storiesCount: 0,
    };
  }
};

export const fetchActiveUserDraftsOnClient = async (
  userId: string,
  limit: number,
  page: number
): Promise<{
  drafts: StoryDraft[];
  hasNextPage: boolean;
  draftsCount: number;
}> => {
  try {
    const supabase = getSupabaseBrowserClient();
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

export const fetchDraftByIdOnClient = async (
  draftId: string
): Promise<StoryDraft | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
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
