"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

export async function deleteReadingList(
  listId: string
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
      .delete()
      .eq("id", listId)
      .eq("is_default", false)
      .select("id")
      .single();

    if (error || !data || !data.id) {
      console.error(error);
      return {
        success: false,
        error: "Failed to delete reading list.",
      };
    }

    return {
      success: true,
      data: {
        listId: data.id,
      },
    };
  } catch (error) {
    console.error("Error in deleteReadingList:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
