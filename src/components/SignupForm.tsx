"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions";
import styles from "./SignupForm.module.css";

const initialState: SubscribeState = { status: "idle", message: "" };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);

  if (state.status === "success") {
    return (
      <p className={styles.success} role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className={styles.form} noValidate>
      <label htmlFor="email" className={styles.visuallyHidden}>
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email Address"
        autoComplete="email"
        required
        className={styles.input}
        aria-invalid={state.status === "error"}
        aria-describedby={state.status === "error" ? "signup-error" : undefined}
      />
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.honeypot}
      />
      <button type="submit" className={styles.button} disabled={pending}>
        {pending ? "Signing up…" : "Get updates"}
      </button>
      {state.status === "error" && (
        <p id="signup-error" className={styles.error} role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
