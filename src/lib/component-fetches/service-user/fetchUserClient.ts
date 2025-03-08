import { UserPopoverServiceUser } from "@/components/popover/UserPopover";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { UserWFollowStatus } from "../../../types/database.types";

export const fetchUserPreviewByIdOnClient = async (
  userId: string
): Promise<{ user: UserPopoverServiceUser } | null> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc(
      "get_service_user_with_follow_status",
      {
        p_user_id: userId,
      }
    );

    if (error || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch target user preview.");
    }

    return {
      user: data[0],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserByIdOnClient = async (
  userId: string
): Promise<UserWFollowStatus | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc(
      "get_user_with_follow_status_by_id",
      { param_user_id: userId }
    );

    if (error || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch target user data.");
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserByUsernameOnClient = async (
  username: string
): Promise<UserWFollowStatus | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc(
      "get_user_with_follow_status_by_username",
      { param_username: username }
    );

    if (error || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch target user data.");
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
