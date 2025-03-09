"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

export async function updateReadingListVisibility(
  listId: string,
  switchTo: "public" | "private"
): Promise<ActionResponse<{ listId: string }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data, error } = await supabase
      .from("reading_lists")
      .update({ visibility: switchTo })
      .eq("id", listId)
      .select("id")
      .single();
    if (error || !data || !data.id) {
      return {
        success: false,
        error: "Failed to update list visibility.",
      };
    }

    return {
      success: true,
      data: {
        listId: data.id,
      },
    };
  } catch (error) {
    console.error("Error in updateReadingList:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
