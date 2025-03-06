import { sendOTPLink } from "@/lib/resend/sendOTPLink";
import { buildUrl } from "@/lib/resend/url-helpers";
import { getSupabaseAdminClient } from "@/supabase-utils/adminClient";
import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string | null;
  const type: EmailOtpType = "magiclink";

  const signInPageUrl = "/email-signin";
  const defaultErrorUrl = buildUrl(`/error?type=${type}`, request);
  const safeEmailString = email ? encodeURIComponent(email) : "";

  if (!email || !type) {
    return NextResponse.redirect(
      buildUrl(
        `${signInPageUrl}?error=${encodeURIComponent("Email is required")}`,
        request
      ),
      302
    );
  }

  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) {
    console.error("You fucked, the admin key isn't available");
    return NextResponse.redirect(defaultErrorUrl, 302);
  }

  const { data, error: userQueryError } = await supabaseAdmin
    .from("service_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (userQueryError || !data) {
    return NextResponse.redirect(
      buildUrl(
        `${signInPageUrl}?error=${encodeURIComponent(
          "Email does not exist"
        )}&email=${encodeURIComponent(email)}`,
        request
      ),
      302
    );
  }

  const otpSuccess = await sendOTPLink(email, type, request);
  if (!otpSuccess) {
    return NextResponse.redirect(defaultErrorUrl, 302);
  } else {
    const thanksUrl = buildUrl(
      `/magic-thanks?type=${type}&email=${safeEmailString}`,
      request
    );
    return NextResponse.redirect(thanksUrl, 302);
  }
}
