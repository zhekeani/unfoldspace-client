import { NextRequest } from "next/server";

/**
 * Builds a full URL based on an application path.
 * Supports both `request` (for API routes) and `origin` (for server actions).
 */
export function buildUrl(
  applicationPath: string,
  requestOrOrigin: NextRequest | string
) {
  let baseUrl: string;

  if (typeof requestOrOrigin === "string") {
    baseUrl = requestOrOrigin; // Use the provided origin
  } else {
    baseUrl = requestOrOrigin.url; // Use request.url (API routes)
  }

  return new URL(applicationPath, baseUrl);
}
