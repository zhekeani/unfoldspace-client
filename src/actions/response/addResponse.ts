"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to add a response
 */
export async function addResponse(
  responseType: "story" | "list",
  htmlContent: string,
  stringJsonContent: string,
  entityId: string,
  parentId?: string
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

    const { data: serviceUserData, error: serviceUserError } =
      await supabase.rpc("get_active_service_user_id");

    if (serviceUserError || !serviceUserData) {
      console.error(serviceUserError);
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }
    const serviceUserId = serviceUserData;

    const isStoryType = responseType === "story";

    const { data: responseData, error: responseError } = isStoryType
      ? await supabase
          .from("responses")
          .insert({
            user_id: serviceUserId,
            story_id: entityId,
            parent_id: parentId || null,
            html_content: htmlContent,
            json_content: JSON.parse(stringJsonContent),
          })
          .select("id")
          .single()
      : await supabase
          .from("reading_list_responses")
          .insert({
            user_id: serviceUserId,
            reading_list_id: entityId,
            parent_id: parentId || null,
            html_content: htmlContent,
            json_content: JSON.parse(stringJsonContent),
          })
          .select("id")
          .single();

    if (responseError || !responseData || !responseData.id) {
      console.error(responseError);
      return {
        success: false,
        error: "Failed to post the response.",
      };
    }

    return {
      success: true,
      data: { responseId: responseData.id, htmlContent, stringJsonContent },
    };
  } catch (error) {
    console.error("Error in addResponse:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
