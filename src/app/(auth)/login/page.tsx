import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { AuthForm } from "../AuthForm";
import styles from "../auth.module.css";

export const metadata: Metadata = {
  title: `Sign in — ${siteConfig.name}`,
};

export default function LoginPage() {
  return (
    <>
      <h1 className={styles.title}>Sign in</h1>
      <p className={styles.lede}>Admin access for the House of Butts team.</p>
      {/* AuthForm reads the URL for link errors, which happens at request time. */}
      <Suspense>
        <AuthForm mode="signin" />
      </Suspense>
      <p className={styles.switch}>
        Need an account? <Link href="/signup">Sign up</Link>
      </p>
    </>
  );
}
