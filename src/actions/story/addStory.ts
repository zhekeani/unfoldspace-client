"use server";

import { countWordsFromJSONContent } from "@/lib/editor/utils/countWords";
import { extractFirstTextNode } from "@/lib/editor/utils/extractFirstParagraph";
import { getRandomHexString } from "@/lib/editor/utils/genRandomHexString";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { Story } from "@/types/database.types";
import { ActionResponse } from "@/types/server-action.types";
import { JSONContent } from "@tiptap/react";

/**
 * Server action to save or update a story.
 */
export async function addStoryDraft(
  storyId: string,
  content: JSONContent,
  stringContent: string
): Promise<ActionResponse<{ draft: Story }>> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }
    const userId = userData.user.id;

    const { data: serviceUserData, error: serviceUserError } = await supabase
      .from("service_users")
      .select("id")
      .eq("supabase_user_id", userId)
      .single();

    if (serviceUserError) {
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }
    const serviceUserId = serviceUserData.id;

    const { data: existingStory, error: fetchError } = await supabase
      .from("stories")
      .select("id")
      .eq("id", storyId)
      .single();

    const isNewStory = !!fetchError || !existingStory;

    let derivedTitle: string = "Untitled Story";
    if (isNewStory) {
      derivedTitle = extractFirstTextNode(content);
    }

    const wordsCount = countWordsFromJSONContent(content);

    const isUpdate = !isNewStory;
    let query;

    // console.log("This is the service user id:", serviceUserId);
    // console.log("This is the story id:", storyId);
    // console.log("This is the title:", derivedTitle);
    // console.log("This is the word count:", wordsCount);
    // console.log("This is the json content:", JSON.parse(stringContent));

    if (isUpdate) {
      query = supabase
        .from("stories")
        .update({
          json_content: JSON.parse(stringContent),
          updated_at: new Date().toISOString(),
          words_count: wordsCount,
        })
        .eq("id", storyId)
        .select("*")
        .single();
    } else {
      query = supabase
        .from("stories")
        .insert([
          {
            id: storyId,
            user_id: serviceUserId,
            title: derivedTitle,
            json_content: JSON.parse(stringContent),
            visibility: "draft",
            words_count: wordsCount,
          },
        ])
        .select("*")
        .single();
    }

    const { data, error: saveError } = await query;

    if (saveError) {
      console.error(saveError);
      throw new Error("Failed to save story to database.");
    }

    return {
      success: true,
      data: {
        draft: data,
      },
    };
  } catch (error) {
    console.error("Error in addStoryDraft:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}

const BUCKET_NAME = "stories";

export async function AddStroyImage(
  storyId: string,
  imageFile: File
): Promise<ActionResponse<{ remoteUrl: string }>> {
  if (!storyId) {
    return { success: false, error: "Missing story ID. Cannot upload image." };
  }

  try {
    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }
    const userId = userData.user.id;

    const { data: serviceUserData, error: serviceUserError } = await supabase
      .from("service_users")
      .select("id")
      .eq("supabase_user_id", userId)
      .single();

    if (serviceUserError) {
      return {
        success: false,
        error: "Failed to fetch user data from current session.",
      };
    }
    const serviceUserId = serviceUserData.id;

    const filePath = [
      serviceUserId,
      storyId,
      `${getRandomHexString(8)}_${imageFile.name}`,
    ].join("/");

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError || !uploadData.path) {
      return {
        success: false,
        error: "Failed to upload image.",
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    const remoteUrl = publicUrlData?.publicUrl || "";

    if (!remoteUrl) {
      return { success: false, error: "Failed to generate public URL" };
    }

    return { success: true, data: { remoteUrl } };
  } catch (error) {
    console.error("Error in uploadImage:", error);

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
