"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  status: "idle" | "success" | "error";
  message: string;
};

const MIN_PASSWORD_LENGTH = 8;

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error?.code === "email_not_confirmed") {
    return {
      status: "error",
      message: "Confirm your email first. Check your inbox for the link we sent.",
    };
  }
  if (error) {
    return { status: "error", message: "That email and password don't match." };
  }

  redirect("/admin");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email) {
    return { status: "error", message: "Enter your email address." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      status: "error",
      message: `Use a password with at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });

  if (error) {
    console.error("Sign up failed", error);
    return { status: "error", message: error.message };
  }

  // Supabase answers the same way for existing emails, so this message
  // doesn't reveal who already has an account.
  return {
    status: "success",
    message:
      "Check your email to confirm your account. You'll be able to see the dashboard once an admin grants you access.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
