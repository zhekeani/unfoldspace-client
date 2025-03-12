"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

export async function updateStoryClap(
  storyId: string,
  actionType: "add" | "remove" = "add"
): Promise<ActionResponse<{ clapId: string }>> {
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

    if (actionType === "add") {
      const { data: clapData, error: clapError } = await supabase
        .from("claps")
        .insert({
          story_id: storyId,
          user_id: serviceUserId,
        })
        .select("id")
        .single();

      if (clapError || !clapData?.id) {
        console.error(clapError);
        return {
          success: false,
          error: `Failed to add clap. ${clapError?.message}`,
        };
      }

      return {
        success: true,
        data: { clapId: clapData.id },
      };
    } else if (actionType === "remove") {
      const { data: removedClap, error: deleteError } = await supabase
        .from("claps")
        .delete()
        .eq("story_id", storyId)
        .eq("user_id", serviceUserId)
        .select("id")
        .single();

      if (deleteError || !removedClap?.id) {
        return {
          success: false,
          error: "No existing clap found to remove.",
        };
      }

      return {
        success: true,
        data: { clapId: removedClap.id },
      };
    }

    return {
      success: false,
      error: "Invalid action type. Use 'add' or 'remove'.",
    };
  } catch (error) {
    console.error("Error in updateStoryClap:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
