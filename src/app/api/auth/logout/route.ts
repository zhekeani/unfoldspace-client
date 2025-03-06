import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await getSupabaseCookiesUtilClient();

  if (supabase) {
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/", request.url));
  }
}
