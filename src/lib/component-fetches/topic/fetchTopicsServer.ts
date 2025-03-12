import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { Topic } from "@/types/database.types";

export const fetchHomeTopicsOnServer = async () => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data: topics, error } = await supabase
      .from("topics")
      .select("id, name")
      .in("depth_level", [0, 1])
      .limit(20);

    if (error || !topics) {
      throw new Error("Failed to fetch topics.");
    }

    return topics;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchAllTopicsOnServer = async (): Promise<{
  topics: Topic[];
} | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data, error } = await supabase.from("topics").select("*");
    if (error || !data) {
      console.error(error);
      throw new Error("Failed to fetch topics.");
    }
    return {
      topics: data,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
