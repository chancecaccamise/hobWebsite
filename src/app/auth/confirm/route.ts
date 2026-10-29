import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Landing spot for the link in Supabase's confirmation email. Handles both the
// default link (?code=) and a custom template using ?token_hash=&type=.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();
  let error: unknown = new Error("Missing confirmation token");

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  }

  if (error) {
    return NextResponse.redirect(new URL("/login?error=confirm", request.url));
  }
  return NextResponse.redirect(new URL("/admin", request.url));
}
