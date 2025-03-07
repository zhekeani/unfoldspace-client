"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

type SaveAction = {
  actionType: "save";
  storyId: string;
  readingListId?: string | null;
};

type UnsaveAction = {
  actionType: "unsave";
  storyId: string;
  readingListId: string;
};

type UpdateReadingListStoryArgs = SaveAction | UnsaveAction;

/**
 * Server action to save (bookmark) or unsave a story in a reading list.
 */
export async function updateReadingListStory(
  args: UpdateReadingListStoryArgs
): Promise<ActionResponse<{ savedId: string }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    let readingListId = args.readingListId;

    if (!readingListId) {
      const { data: defaultListId, error: defaultListError } =
        await supabase.rpc("get_active_default_reading_list_id");

      if (defaultListError || !defaultListId) {
        return {
          success: false,
          error: "Failed to fetch the default reading list ID.",
        };
      }

      readingListId = defaultListId;
    }

    if (args.actionType === "save") {
      const { data: savedData, error: saveError } = await supabase
        .from("reading_list_items")
        .insert({
          reading_list_id: readingListId,
          story_id: args.storyId,
        })
        .select("id")
        .single();

      if (saveError || !savedData?.id) {
        console.error(saveError);
        return {
          success: false,
          error: `Failed to save story to reading list. ${saveError?.message}`,
        };
      }

      return {
        success: true,
        data: { savedId: savedData.id },
      };
    }

    if (args.actionType === "unsave") {
      const { data: removedSave, error: deleteError } = await supabase
        .from("reading_list_items")
        .delete()
        .eq("reading_list_id", readingListId)
        .eq("story_id", args.storyId)
        .select("id")
        .single();

      if (deleteError || !removedSave?.id) {
        return {
          success: false,
          error: "No existing saved story found to remove.",
        };
      }

      return {
        success: true,
        data: { savedId: removedSave.id },
      };
    }

    return {
      success: false,
      error: "Invalid action type. Use 'save' or 'unsave'.",
    };
  } catch (error) {
    console.error("Error in updateReadingListStory:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
