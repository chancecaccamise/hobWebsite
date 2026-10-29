"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions";
import { siteConfig } from "@/config/site";
import styles from "./ContactForm.module.css";

const initialState: ContactState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const { eyebrow, heading, text, button } = siteConfig.contact;

  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id="contact-heading" className={styles.heading}>
        {heading}
      </h2>
      <p className={styles.text}>{text}</p>

      {state.status === "success" ? (
        <p className={styles.success} role="status">
          {state.message}
        </p>
      ) : (
        <form action={formAction} className={styles.form}>
          <label className={`${styles.field} ${styles.full}`}>
            <span className={styles.label}>Full name</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              maxLength={200}
              required
              defaultValue={state.fields?.name}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              defaultValue={state.fields?.email}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>
              Phone <span className={styles.optional}>(optional)</span>
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={25}
              defaultValue={state.fields?.phone}
              className={styles.input}
            />
          </label>
          <label className={`${styles.field} ${styles.full}`}>
            <span className={styles.label}>Message</span>
            <textarea
              name="message"
              rows={5}
              maxLength={5000}
              required
              defaultValue={state.fields?.message}
              className={`${styles.input} ${styles.textarea}`}
            />
          </label>
          {/* Honeypot for bots; hidden from people and assistive tech. */}
          <input
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className={styles.honeypot}
          />
          {state.status === "error" && (
            <p className={`${styles.error} ${styles.full}`} role="alert">
              {state.message}
            </p>
          )}
          <button type="submit" className={styles.button} disabled={pending}>
            {pending ? "Sending…" : button}
          </button>
        </form>
      )}
    </section>
  );
}
