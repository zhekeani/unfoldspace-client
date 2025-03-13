"use server";

import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to update user profile data
 */
export async function updateUserProfile(
  name: string,
  pronouns?: string | null,
  shortBio?: string | null,
  avatarFile?: File | null
): Promise<ActionResponse<string>> {
  let userId: string | null = null;
  let serviceUserId: string | null = null;

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

    userId = userData.user.id;
    let avatarUrl: string | null = null;
    let uploadedFilePath: string | null = null;

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

    serviceUserId = serviceUserData.id;

    if (avatarFile) {
      const bucketName = "avatars";
      const filePath = `${serviceUserId}/${avatarFile.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError || !uploadData.fullPath) {
        console.error(uploadError);
        return { success: false, error: "Failed to upload profile picture." };
      }

      uploadedFilePath = filePath;
      avatarUrl = supabase.storage.from(bucketName).getPublicUrl(filePath)
        .data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("service_users")
      .update({
        name,
        pronouns,
        short_bio: shortBio,
        ...(avatarUrl ? { profile_picture: avatarUrl } : {}),
      })
      .eq("supabase_user_id", userId);

    if (updateError) {
      if (uploadedFilePath) {
        await supabase.storage.from("avatars").remove([uploadedFilePath]);
      }
      return { success: false, error: "Failed to update user profile." };
    }

    return { success: true, data: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);

    if (avatarFile) {
      const bucketName = "avatars";
      const filePath = `${serviceUserId}/${avatarFile.name}`;
      await getSupabaseCookiesUtilClient()
        .then((supabase) =>
          supabase?.storage.from(bucketName).remove([filePath])
        )
        .catch((err) => console.error("Failed to rollback avatar:", err));
    }

    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
