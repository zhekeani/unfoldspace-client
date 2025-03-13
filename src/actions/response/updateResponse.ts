"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to update story response
 */
export async function updateResponse(
  responseType: "story" | "list",
  responseId: string,
  htmlContent: string,
  stringJsonContent: string
): Promise<
  ActionResponse<{
    responseId: string;
    htmlContent: string;
    stringJsonContent: string;
  }>
> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const isStoryType = responseType === "story";

    const { data: updateData, error: updateError } = isStoryType
      ? await supabase
          .from("responses")
          .update({
            html_content: htmlContent,
            json_content: JSON.parse(stringJsonContent),
            edited_at: new Date().toISOString(),
          })
          .eq("id", responseId)
          .select("*")
          .single()
      : await supabase
          .from("reading_list_responses")
          .update({
            html_content: htmlContent,
            json_content: JSON.parse(stringJsonContent),
            edited_at: new Date().toISOString(),
          })
          .eq("id", responseId)
          .select("*")
          .single();

    if (updateError || !updateData.id) {
      console.error(updateError);
      return {
        success: false,
        error: "Failed to update response.",
      };
    }

    return {
      success: true,
      data: {
        responseId,
        htmlContent: updateData.html_content,
        stringJsonContent: JSON.stringify(updateData.json_content),
      },
    };
  } catch (error) {
    console.error("Error in updateResponse:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
