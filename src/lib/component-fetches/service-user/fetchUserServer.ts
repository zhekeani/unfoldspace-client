import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ServiceUser, UserWFollowStatus } from "@/types/database.types";

export const fetchUserOnServer = async (): Promise<{
  serviceUser: ServiceUser;
} | null> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc("get_active_service_user");
    if (error || !data) {
      console.error(error);
      throw new Error("Failed to fetch active user data.");
    }

    return {
      serviceUser: data[0],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserByUsernameOnServer = async (
  username: string
): Promise<UserWFollowStatus | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
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

export const fetchActiveUserIdOnServer = async (): Promise<string | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data: userId, error } = await supabase.rpc(
      "get_active_service_user_id"
    );

    if (error || !userId) {
      console.error(error);
      throw new Error("Failed to fetch active user data.");
    }

    return userId;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserIdByUsernameOnServer = async (
  username: string
): Promise<string | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) throw new Error("Database client unavailable.");

    console.log("This is the fucking username:", username);

    const { data, error } = await supabase
      .from("service_users")
      .select("id")
      .eq("username", username)
      .single();

    if (error || !data) {
      console.error(error);
      throw new Error("Failed to fetch ID from username.");
    }

    return data.id;
  } catch (error) {
    console.error(error);
    return null;
  }
};
