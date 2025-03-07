import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ReadingList } from "@/types/database.types";

export const fetchUserReadingListsById = async (
  userId: string
): Promise<ReadingList[] | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase
      .from("reading_lists")
      .select("*")
      .eq("user_id", userId)
      .eq("visibility", "public");

    if (error) {
      console.error(error);
      throw new Error("Failed to fetch user reading lists.");
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
