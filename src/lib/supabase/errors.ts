import type { PostgrestError } from "@supabase/supabase-js";

// Supabase returns plain error objects; wrap them so the message and code show
// up in logs and the Next.js error overlay instead of "{code: ..., ...}".
export function toError(error: PostgrestError) {
  return new Error(`Supabase: ${error.message} (${error.code})`, { cause: error });
}
