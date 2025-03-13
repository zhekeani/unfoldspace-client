"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to initiate an username change.
 */
export async function updateUsername(
  newUsername: string
): Promise<ActionResponse<string>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data: existingUser } = await supabase
      .from("service_users")
      .select("username")
      .eq("username", newUsername)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: "This Username is already in use.",
      };
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }

    const { error: updateError } = await supabase
      .from("service_users")
      .update({ username: newUsername })
      .eq("supabase_user_id", userData.user.id);

    if (updateError) {
      return {
        success: false,
        error: "Server error: Failed to update username.",
      };
    }

    return {
      success: true,
      data: `Your username has been updated to ${newUsername}`,
    };
  } catch (error) {
    console.error("Error in updateUsername:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later",
    };
  }
}
