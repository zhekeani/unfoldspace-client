import { ExtendedReadingList } from "@/components/reading-list/ReadingListItem";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ReadingList, ReadingListDetail } from "@/types/database.types";

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

export const fetchUserDetailedReadingListsByIdOnServer = async (
  userId: string,
  limit: number,
  page: number
): Promise<{
  readingLists: ExtendedReadingList[];
  hasNextPage: boolean;
  readingListsCount: number;
} | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }
    const offset = (page - 1) * limit;

    const [readingListRes, countRes] = await Promise.all([
      supabase.rpc("get_user_reading_lists_by_id", {
        target_user_id: userId,
        limit_param: limit + 1,
        offset_param: offset,
      }),
      supabase
        .from("reading_lists")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    if (readingListRes.error) {
      console.error(readingListRes.error);
      throw new Error("Failed to fetch user reading lists.");
    }
    if (countRes.error) {
      console.error(countRes.error);
      throw new Error("Failed to fetch reading list count.");
    }

    const hasNextPage = readingListRes.data.length > limit;

    return {
      readingLists: readingListRes.data.slice(0, limit),
      hasNextPage,
      readingListsCount: countRes.count || 0,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchActiveUserSavedReadingListsOnServer = async (
  userId: string,
  limit: number,
  page: number
): Promise<{
  readingLists: ExtendedReadingList[];
  hasNextPage: boolean;
  readingListsCount: number;
} | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }
    const offset = (page - 1) * limit;

    const [readingListRes, countRes] = await Promise.all([
      supabase.rpc("get_active_user_saved_reading_lists", {
        limit_param: limit + 1,
        offset_param: offset,
      }),
      supabase
        .from("saved_reading_lists")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    if (readingListRes.error) {
      console.error(readingListRes.error);
      throw new Error("Failed to fetch saved reading lists.");
    }
    if (countRes.error) {
      console.error(countRes.error);
      throw new Error("Failed to fetch saved reading list count.");
    }

    const hasNextPage = readingListRes.data.length > limit;

    return {
      readingLists: readingListRes.data.slice(0, limit),
      hasNextPage,
      readingListsCount: countRes.count || 0,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchReadingListDetailByIdOnServer = async (
  listId: string
): Promise<{
  readingList: ReadingListDetail;
} | null> => {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data, error } = await supabase.rpc("get_reading_list_detail", {
      list_id_param: listId,
    });
    if (error || !data) {
      console.error(error);
      throw new Error("Failed to fetch reading list.");
    }

    return {
      readingList: data[0],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
