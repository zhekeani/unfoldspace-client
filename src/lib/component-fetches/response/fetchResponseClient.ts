import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import {
  ExtendedListResponse,
  ExtendedStoryResponse,
} from "@/types/database.types";

export const fetchStoryResponses = async (
  storyId: string,
  limit: number,
  pageParam?: null | string
): Promise<{
  responses: ExtendedStoryResponse[];
  nextCursor: string | null;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc("get_story_responses", {
      story_id_param: storyId,
      limit_param: limit,
      cursor: pageParam || undefined,
    });

    if (error || !data) {
      console.error(error);
      throw new Error(error.message);
    }

    return {
      responses: data,
      nextCursor: data.length > 0 ? data[data.length - 1].created_at : null,
    };
  } catch (error) {
    console.error(error);
    return {
      responses: [],
      nextCursor: null,
    };
  }
};

export const fetchResponse = async <
  T extends ExtendedStoryResponse | ExtendedListResponse,
>(
  responseId: string,
  responseType: "story" | "list"
): Promise<T | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      throw new Error("Database client unavailable.");
    }

    const { data, error } = await supabase.rpc(
      responseType === "story"
        ? "get_response_by_id"
        : "get_reading_list_response_by_id",
      { response_id_param: responseId }
    );

    if (error || !data || data.length === 0) {
      console.error(error);
      throw new Error("Failed to fetch response.");
    }

    return data[0] as T;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchResponseReplies = async <
  T extends ExtendedStoryResponse | ExtendedListResponse,
>(
  responseId: string,
  responseType: "story" | "list"
): Promise<T[] | null> => {
  try {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Database client unavailable.");

    const { data, error } = await supabase.rpc(
      responseType === "story"
        ? "get_response_replies"
        : "get_reading_list_response_replies",
      {
        parent_id_param: responseId,
      }
    );

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data as T[];
  } catch (error) {
    console.error(error);
    return null;
  }
};
