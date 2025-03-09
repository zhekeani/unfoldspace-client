"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

export async function deletePublishedStory(
  storyId: string
): Promise<ActionResponse<{ storyId: string }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data: deleteData, error: deleteError } = await supabase
      .from("stories")
      .delete()
      .eq("id", storyId)
      .eq("visibility", "published")
      .select("id")
      .single();

    if (deleteError || !deleteData.id) {
      console.error(deleteError);
      return {
        success: false,
        error: "Failed to delete published story.",
      };
    }

    return {
      success: true,
      data: {
        storyId: deleteData.id,
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
