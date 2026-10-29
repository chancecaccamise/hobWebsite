import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { AuthForm } from "../AuthForm";
import styles from "../auth.module.css";

export const metadata: Metadata = {
  title: `Create an account — ${siteConfig.name}`,
};

export default function SignupPage() {
  return (
    <>
      <h1 className={styles.title}>Create an account</h1>
      <p className={styles.lede}>
        New accounts can&apos;t see anything until an existing admin grants access.
      </p>
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
      <p className={styles.switch}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
