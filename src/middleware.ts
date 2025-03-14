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

  // Protect actual routes under (protected) and editor
  const protectedRoutes = [
    "/home",
    "/me",
    "/explore-topics",
    "/settings",
    "/stories",
    "/lists",
    "/reading-history",
    "/saved",
    "/notifications",
    "/publishing",
    "/security",
    "/drafts",
    "/public",
    "/responses",
    "/editor",
  ];

  // Check if the route is protected
  const isProtectedRoute =
    protectedRoutes.some((route) => requestedPath.startsWith(route)) ||
    requestedPath.startsWith("/%40") ||
    requestedPath.startsWith("/@"); // Protect dynamic username routes

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (user && requestedPath === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return response.value;
}

export const config = {
  matcher: ["/((?!^/$).*)"],
};
