import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { Topic } from "@/types/database.types";

export const fetchAllTopicsOnClient = async (): Promise<{
  topics: Topic[];
} | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
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
