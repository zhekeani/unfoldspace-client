import {
  generateDisplayName,
  generateUniqueUsername,
  sanitizeUsername,
} from "@/lib/api/generateDefaultValues";
import { sendOTPLink } from "@/lib/resend/sendOTPLink";
import { buildUrl } from "@/lib/resend/url-helpers";
import { getSupabaseAdminClient } from "@/supabase-utils/adminClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isNotEmptyString = (value: any) => {
    return typeof value === "string" && value.trim().length > 0;
  };

  const emailRegex = /^\S+@\S+$/;
  const safeEmailString = email ? encodeURIComponent(email) : "";

  if (!isNotEmptyString(email) || !email || !emailRegex.test(email)) {
    console.log("failed the email check", email);
    return NextResponse.redirect(
      buildUrl(
        `/email-signup?error=${encodeURIComponent(
          "Invalid email address"
        )}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  const emailPrefix = email.split("@")[0];
  const sanitizedUsername = sanitizeUsername(emailPrefix);

  const supabaseAdmin = getSupabaseAdminClient();

  if (!supabaseAdmin) {
    return NextResponse.redirect(
      buildUrl(
        `/email-signup?error=${encodeURIComponent(
          "Server error: unable to connect to database"
        )}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
    });

  if (userError) {
    const userExists = userError.message.includes("already been registered");
    if (userExists) {
      return NextResponse.redirect(
        buildUrl(
          `/email-signup?error=${encodeURIComponent(
            "Email already exists"
          )}&email=${safeEmailString}`,
          request
        ),
        302
      );
    } else {
      return NextResponse.redirect(
        buildUrl(
          `/email-signup?error=${encodeURIComponent(
            "Registration error: " + userError.message
          )}&email=${safeEmailString}`,
          request
        ),
        302
      );
    }
  }

  const uniqueUsername = await generateUniqueUsername(
    sanitizedUsername,
    supabaseAdmin
  );
  const displayName = generateDisplayName(sanitizedUsername);

  const { error: serviceUserError } = await supabaseAdmin
    .from("service_users")
    .insert({
      email: userData.user.email!,
      username: uniqueUsername,
      name: displayName,
      supabase_user_id: userData.user.id,
    })
    .select()
    .single();

  if (serviceUserError) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    return NextResponse.redirect(
      buildUrl(
        `/email-signup?error=${encodeURIComponent(
          "Server error: unable to create user profile"
        )}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  await sendOTPLink(email, "signup", request);
  return NextResponse.redirect(
    buildUrl(`/registration-success?email=${safeEmailString}`, request),
    302
  );
}
