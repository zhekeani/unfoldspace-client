"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to follow or unfollow other user.
 */
export async function updateUserFollowing(
  targetUserId: string,
  actionType: "follow" | "unfollow" = "follow"
): Promise<ActionResponse<{ followingId: string; targetUserId: string }>> {
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
      return {
        success: false,
        error: "Failed to fetch active user data from current session.",
      };
    }

    const query =
      actionType === "follow"
        ? supabase
            .from("following")
            .insert({ follower_id: activeUserId, following_id: targetUserId })
            .select("id, following_id")
            .single()
        : supabase
            .from("following")
            .delete()
            .eq("following_id", targetUserId)
            .eq("follower_id", activeUserId)
            .select("id, following_id")
            .single();

    const { data: followingData, error: followingError } = await query;
    if (followingError || !followingData || !followingData.id) {
      return {
        success: false,
        error: `Failed to ${actionType} target user.`,
      };
    }

    return {
      success: true,
      data: {
        followingId: followingData.id,
        targetUserId: followingData.following_id,
      },
    };
  } catch (error) {
    console.error("Error in updateUserFollowing:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
