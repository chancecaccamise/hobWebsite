import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response, isSignedIn } = await updateSession(request);

  // Optimistic check only. Admin pages and the database (RLS) verify access
  // again, so this just saves signed-out visitors a round trip.
  if (!isSignedIn && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup"],
};
