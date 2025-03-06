import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ServiceUser } from "@/types/database.types";

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
