"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to delete a response
 */
export async function deleteResponse(
  responseId: string,
  responseType: "story" | "list"
): Promise<
  ActionResponse<{
    responseId: string;
    parentId: string | null;
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

    const isStoryType = responseType === "story";

    const { data: deleteData, error: deleteError } = isStoryType
      ? await supabase
          .from("responses")
          .delete()
          .eq("id", responseId)
          .select("id, parent_id")
          .single()
      : await supabase
          .from("reading_list_responses")
          .delete()
          .eq("id", responseId)
          .select("id , parent_id")
          .single();

    if (deleteError || !deleteData.id) {
      console.error(deleteError);
      return {
        success: false,
        error: "Failed to delete response.",
      };
    }

    return {
      success: true,
      data: {
        responseId: deleteData.id,
        parentId: deleteData.parent_id || null,
      },
    };
  } catch (error) {
    console.error("Error in deleteResponse:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
