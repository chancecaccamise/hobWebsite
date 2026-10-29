import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { toError } from "@/lib/supabase/errors";

export type AdminSession = {
  email: string;
  isAdmin: boolean;
};

/**
 * Verifies the signed-in user and whether they've been granted admin access.
 * Redirects to /login when nobody is signed in. Deduplicated per request.
 */
export const getAdminSession = cache(async (): Promise<AdminSession> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) throw toError(error);

  return { email: String(data.claims.email ?? ""), isAdmin: isAdmin === true };
});

/** For Server Actions and writes: stops anyone who isn't an admin. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isAdmin) redirect("/admin");
  return session;
}
