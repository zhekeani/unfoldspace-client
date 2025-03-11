"use server";

import { getSupabaseCookiesUtilClient } from "../../supabase-utils/cookiesUtilClient";
import { ActionResponse } from "../../types/server-action.types";

export async function deleteMultipleListItems(
  listItemIds: string[]
): Promise<ActionResponse<{ deletedCount: number }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data, error } = await supabase
      .from("reading_list_items")
      .delete()
      .in("id", listItemIds)
      .select("id");
    if (error || !data || data.length === 0) {
      return {
        success: false,
        error: "Failed to remove list items.",
      };
    }

    return {
      success: true,
      data: {
        deletedCount: data.length,
      },
    };
  } catch (error) {
    console.error("Error in deleteListItem:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
