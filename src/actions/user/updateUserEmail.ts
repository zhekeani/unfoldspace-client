"use server";

import { generateEmailChangeLink } from "@/lib/resend/sendEmailChangeLink";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ActionResponse } from "@/types/server-action.types";

/**
 * Server action to initiate an email change.
 * Sends a verification link ONLY to the current email.
 * After verification, the "email_change_new" link will be sent automatically.
 */
export async function updateUserEmail(
  newEmail: string,
  origin: string
): Promise<ActionResponse<string>> {
  try {
    const emailRegex = /^\S+@\S+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      return { success: false, error: "Invalid email address format." };
    }

    const supabase = await getSupabaseCookiesUtilClient();
    if (!supabase) {
      return {
        success: false,
        error: "Server error: Database client unavailable.",
      };
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return { success: false, error: "User not authenticated" };
    }

    const { data: existingUser, error: emailCheckError } = await supabase
      .from("service_users")
      .select("id")
      .eq("email", newEmail)
      .maybeSingle();

    if (emailCheckError) {
      return { success: false, error: "Error checking email availability." };
    }

    if (existingUser) {
      return { success: false, error: "This email is already in use." };
    }

    const emailChangeSent = await generateEmailChangeLink(
      user.email, // Current email
      newEmail, // New email
      origin
    );

    if (!emailChangeSent) {
      return {
        success: false,
        error: "Failed to send verification email. Please try again.",
      };
    }

    return {
      success: true,
      data: "A verification email has been sent to your current email address. Please verify it to proceed with the email change.",
    };
  } catch (error) {
    console.error("Error in updateUserEmail:", error);
    return {
      success: false,
      error: "Unexpected server error. Please try again later.",
    };
  }
}
