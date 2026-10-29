import "server-only";
import { createClient } from "@/lib/supabase/server";
import { toError } from "@/lib/supabase/errors";

export type Subscriber = { id: string; email: string; createdAt: string };

const UNIQUE_VIOLATION = "23505";
const RANGE_NOT_SATISFIABLE = "PGRST103";

/** Returns false if the email was already subscribed. */
export async function addSubscriber(email: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert({ email });

  if (error?.code === UNIQUE_VIOLATION) return false;
  if (error) throw toError(error);
  return true;
}

/** Total signups, and how many came in over the last 7 days. */
export async function getSubscriberCounts() {
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const table = () => supabase.from("subscribers").select("id", { count: "exact", head: true });

  const [all, recent] = await Promise.all([table(), table().gte("created_at", weekAgo)]);
  if (all.error) throw toError(all.error);
  if (recent.error) throw toError(recent.error);

  return { total: all.count ?? 0, lastWeek: recent.count ?? 0 };
}

/**
 * Lists subscribers, newest first. Row-level security only returns rows to
 * admins, so a non-admin session gets an empty list.
 */
export async function listSubscribers(page: number, pageSize: number) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;

  const { data, count, error } = await supabase
    .from("subscribers")
    .select("id, email, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  // Asking for a page past the end isn't an error worth crashing over.
  if (error?.code === RANGE_NOT_SATISFIABLE) return { subscribers: [], total: 0 };
  if (error) throw toError(error);

  const subscribers: Subscriber[] = data.map((row) => ({
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  }));
  return { subscribers, total: count ?? 0 };
}
