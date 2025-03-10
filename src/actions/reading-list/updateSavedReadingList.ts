"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to save (bookmark) or unsave a reading list.
 */
export async function updateSavedReadingLists(
  listId: string,
  actionType: "save" | "unsave"
): Promise<ActionResponse<{ savedListId: string }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data: activeUserId, error: activeUserError } = await supabase.rpc(
      "get_active_service_user_id"
    );
    if (activeUserError || !activeUserId) {
      console.error(activeUserError);
      return {
        success: false,
        error: "Failed to fetch active user ID",
      };
    }

    const query =
      actionType === "save"
        ? supabase
            .from("saved_reading_lists")
            .insert({ user_id: activeUserId, reading_list_id: listId })
            .select("id")
            .single()
        : supabase
            .from("saved_reading_lists")
            .delete()
            .eq("reading_list_id", listId)
            .eq("user_id", activeUserId)
            .select("id")
            .single();

    const { data, error } = await query;

    if (error || !data || !data.id) {
      console.error(error);
      return {
        success: false,
        error: `Failed to ${actionType} reading list`,
      };
    }

    return {
      success: true,
      data: {
        savedListId: data.id,
      },
    };
  } catch (error) {
    console.error("Error in updateReadingListStory:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
