import { buildUrl } from "@/lib/resend/url-helpers";
import { getSupabaseAdminClient } from "@/supabase-utils/adminClient";
import { GenerateEmailChangeLinkParams, User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface ExtendedUser extends User {
  email_change?: string;
}

/**
 * Handles email change verification (strictly for `email_change_current`).
 * Updates the `service_users` table to match the new email.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hashed_token = searchParams.get("hashed_token");
  const type = searchParams.get(
    "type"
  ) as GenerateEmailChangeLinkParams["type"];

  if (!hashed_token || type !== "email_change_current") {
    return NextResponse.redirect(
      buildUrl("/error?type=invalid_request", request)
    );
  }

  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.redirect(buildUrl("/error?type=server_error", request));
  }

  const { error, data } = await supabaseAdmin.auth.verifyOtp({
    type: "email_change",
    token_hash: hashed_token,
  });

  if (error) {
    return NextResponse.redirect(
      buildUrl("/error?type=invalid_magiclink", request)
    );
  }

  const userId = data?.user?.id;
  if (!userId) {
    return NextResponse.redirect(
      buildUrl("/error?type=email_change_failed", request)
    );
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.getUserById(userId);
  if (userError || !userData?.user) {
    return NextResponse.redirect(
      buildUrl("/error?type=user_not_found", request)
    );
  }

  const user = userData.user as ExtendedUser;

  if (!user.email_change) {
    const { error: updateError } = await supabaseAdmin
      .from("service_users")
      .update({ email: user.email })
      .eq("supabase_user_id", user.id);

    if (updateError) {
      return NextResponse.redirect(
        buildUrl("/error?type=email_sync_failed", request)
      );
    }

    return NextResponse.redirect(
      buildUrl("/me/settings?status=email_changed", request)
    );
  }

  return NextResponse.redirect(
    buildUrl("/me/settings?status=email_pending", request)
  );
}
