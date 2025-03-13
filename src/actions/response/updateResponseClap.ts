"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to add or remove a clap to or from a response
 */
export async function updateResponseClap(
  responseId: string,
  actionType: "add" | "remove" = "add",
  responseType: "story" | "list"
): Promise<ActionResponse<{ clapId: string }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const isStoryType = responseType === "story";

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }
    const userId = userData.user.id;

    const { data: serviceUserData, error: serviceUserError } = await supabase
      .from("service_users")
      .select("id")
      .eq("supabase_user_id", userId)
      .single();

    if (serviceUserError) {
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }
    const serviceUserId = serviceUserData.id;

    if (actionType === "add") {
      const { data: clapData, error: clapError } = isStoryType
        ? await supabase
            .from("response_claps")
            .insert({
              response_id: responseId,
              user_id: serviceUserId,
            })
            .select("id")
            .single()
        : await supabase
            .from("reading_list_response_claps")
            .insert({
              response_id: responseId,
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
      const { data: removedClap, error: deleteError } = isStoryType
        ? await supabase
            .from("response_claps")
            .delete()
            .eq("response_id", responseId)
            .eq("user_id", serviceUserId)
            .select("id")
            .single()
        : await supabase
            .from("reading_list_response_claps")
            .delete()
            .eq("response_id", responseId)
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
    console.error("Error in updateResponseClap:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
