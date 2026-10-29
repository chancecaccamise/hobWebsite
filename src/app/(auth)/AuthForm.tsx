"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signUp, type AuthState } from "./actions";
import styles from "./auth.module.css";

const initialState: AuthState = { status: "idle", message: "" };

const LINK_ERRORS: Record<string, string> = {
  confirm:
    "That confirmation link didn't work or has expired. If you already confirmed your email, sign in below.",
};

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const isSignUp = mode === "signup";
  const [state, formAction, pending] = useActionState(isSignUp ? signUp : signIn, initialState);
  const linkError = LINK_ERRORS[useSearchParams().get("error") ?? ""];

  if (state.status === "success") {
    return (
      <p className={styles.success} role="status">
        {state.message}
      </p>
    );
  }

  const error = state.status === "error" ? state.message : linkError;

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className={styles.input}
        />
      </label>
      <label className={styles.field}>
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={isSignUp ? 8 : undefined}
          required
          className={styles.input}
        />
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={styles.button} disabled={pending}>
        {isSignUp
          ? pending ? "Creating account…" : "Create account"
          : pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
