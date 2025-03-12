"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { Story } from "@/types/database.types";
import { ActionResponse } from "@/types/server-action.types";

export async function updateStory(
  storyId: string,
  values: Partial<Story>
): Promise<ActionResponse<{ story: Story }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data, error } = await supabase
      .from("stories")
      .update(values)
      .eq("id", storyId)
      .select("*")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: "Failed to update story.",
      };
    }

    return {
      success: true,
      data: {
        story: data,
      },
    };
  } catch (error) {
    console.error("Error in addStoryDraft:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}

export async function updateStoryTopics(
  storyId: string,
  topicIds: string[]
): Promise<ActionResponse<{ storyId: string; topicIds: string[] }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    if (topicIds.length < 1 || topicIds.length > 5) {
      return {
        success: false,
        error: "You must select between 1 and 5 topics.",
      };
    }

    const { error } = await supabase.rpc("update_story_topics", {
      p_story_id: storyId,
      p_new_topic_ids: topicIds,
    });

    if (error) {
      console.error("Error updating story topics:", error);
      return {
        success: false,
        error: "Failed to update story topics.",
      };
    }
    return {
      success: true,
      data: {
        storyId,
        topicIds,
      },
    };
  } catch (error) {
    console.error("Error in updateStory:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}

export async function publishStory(
  storyId: string,
  previewImage: string | null,
  htmlContent: string
): Promise<
  ActionResponse<{
    story: Story;
  }>
> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data: publishData, error: publishError } = await supabase
      .from("stories")
      .update({
        cover_image: previewImage,
        html_content: htmlContent,
        visibility: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", storyId)
      .select("*")
      .single();

    if (publishError || !publishData.id) {
      console.error(publishError);
      return {
        success: false,
        error: "Failed to publish story.",
      };
    }

    return {
      success: true,
      data: {
        story: publishData,
      },
    };
  } catch (error) {
    console.error("Error in saveStory:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
