"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ReadingListItem } from "@/types/database.types";
import { ActionResponse } from "@/types/server-action.types";

export async function updateListItemsOrder(
  listId: string,
  reorderedItems: Pick<ReadingListItem, "id" | "item_order">[]
): Promise<ActionResponse<{ listId: string }>> {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const newOrderedIds = reorderedItems.reverse().map((item) => item.id);

    const { error } = await supabase.rpc("reorder_reading_list_items", {
      p_reading_list_id: listId,
      p_ordered_ids: newOrderedIds,
    });

    if (error) {
      return {
        success: false,
        error: "Failed to reorder reading list items.",
      };
    }

    return {
      success: true,
      data: {
        listId: listId,
      },
    };
  } catch (error) {
    console.error("Error in updateListItems:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}

export async function updateListItemNote(
  listItemId: string,
  note: string | null
): Promise<ActionResponse<{ listItemId: string }>> {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data, error } = await supabase
      .from("reading_list_items")
      .update({ note })
      .eq("id", listItemId)
      .select("id")
      .single();
    if (error || !data || !data.id) {
      console.error(error);
      return {
        success: false,
        error: "Failed to update list item note.",
      };
    }

    return {
      success: true,
      data: {
        listItemId: data.id,
      },
    };
  } catch (error) {
    console.error("Error in updateListItems:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
