import { getSupabaseReqResClient } from "@/supabase-utils/reqResClient";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const client = getSupabaseReqResClient({ request });

  if (!client) {
    return NextResponse.next();
  }

  const { supabase, response } = client;
  const { data } = await supabase.auth.getUser();

  const user = data?.user;
  const requestedPath = request.nextUrl.pathname;

  if (!user && requestedPath.startsWith("/home")) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (user && requestedPath === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return response.value;
}

export const config = {
  matcher: ["/((?!^/$).*)"],
};
