import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Create a new client per request; it reads and refreshes the auth cookies.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components can't set cookies. Safe to ignore: the proxy
            // refreshes the session before the page renders.
          }
        },
      },
    },
  );
}
