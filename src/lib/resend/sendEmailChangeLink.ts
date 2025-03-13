import { GenerateEmailChangeLinkParams } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

import MagicLinkTemplate from "@/email-template/MagicLink-template";
import { getSupabaseAdminClient } from "@/supabase-utils/adminClient";
import resend from "../resend/resendClient";
import { contentMap } from "./data/magicLinkContents";
import { buildUrl } from "./url-helpers";

/**
 * Generates and sends email change verification link.
 */
export async function generateEmailChangeLink(
  currentEmail: string,
  newEmail: string,
  requestOrOrigin: NextRequest | string
): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) return false;

  try {
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "email_change_current",
        email: currentEmail,
        newEmail,
      } as GenerateEmailChangeLinkParams);

    if (linkError || !linkData.properties) {
      console.error("Supabase generateLink error:", linkError);
      return false;
    }

    const verificationLink = buildUrl(
      `/api/auth/verify-change-email?hashed_token=${linkData.properties.hashed_token}&type=email_change_current`,
      requestOrOrigin
    );

    const { error: sendError } = await resend.emails.send({
      from: "noreply@unfoldspace.cc",
      to: [newEmail],
      subject: contentMap["email_change_current"].subject,
      react: MagicLinkTemplate({
        magicLink: verificationLink,
        type: "email_change_current",
      }),
    });

    if (sendError) {
      console.error("Error sending email change verification:", sendError);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error in generateEmailChangeLink:", err);
    return false;
  }
}
