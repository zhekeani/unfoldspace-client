"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ReadingList } from "@/types/database.types";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to create a reading list
 */
export async function createReadingList(
  name: string,
  description: string | null,
  visibility: "public" | "private"
): Promise<ActionResponse<{ readingList: ReadingList }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data: serviceUserData, error: serviceUserError } =
      await supabase.rpc("get_active_service_user_id");

    if (serviceUserError || !serviceUserData) {
      console.error(serviceUserError);
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }
    const serviceUserId = serviceUserData;

    const { data: readingListData, error: readingListError } = await supabase
      .from("reading_lists")
      .insert({
        title: name,
        user_id: serviceUserId,
        visibility,
        description,
      })
      .select("*")
      .single();

    if (readingListError || !readingListData || !readingListData.id) {
      return {
        success: false,
        error: "Failed to create reading list.",
      };
    }

    return {
      success: true,
      data: { readingList: readingListData },
    };
  } catch (error) {
    console.error("Error in createReadingList:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
