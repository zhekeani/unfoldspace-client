import MagicLinkTemplate from "@/email-template/MagicLink-template";
import { contentMap } from "@/lib/resend/data/magicLinkContents";
import resend from "@/lib/resend/resendClient";
import { buildUrl } from "@/lib/resend/url-helpers";
import { getSupabaseAdminClient } from "@/supabase-utils/adminClient";
import { EmailOtpType, GenerateLinkParams } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { ReactNode } from "react";

export async function sendOTPLink(
  email: string,
  type: EmailOtpType,
  request: NextRequest
): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) return false;

  try {
    const { data: linkData, error } =
      await supabaseAdmin.auth.admin.generateLink({
        email,
        type,
      } as GenerateLinkParams);

    if (error) {
      console.error("Supabase generateLink error:", error);
      return false;
    }

    const { hashed_token } = linkData.properties;
    const constructedLink = buildUrl(
      `/api/auth/verify?hashed_token=${hashed_token}&type=${type}`,
      request
    );

    const emailHtml = MagicLinkTemplate({
      magicLink: constructedLink,
      type,
    }) as ReactNode;

    const { error: sendError } = await resend.emails.send({
      from: "noreply@unfoldspace.cc",
      to: [email],
      subject: contentMap[type].subject, // Dynamic subject
      react: emailHtml,
    });

    return !sendError;
  } catch (err) {
    console.error("Unexpected error in sendOTPLink:", err);
    return false;
  }
}
