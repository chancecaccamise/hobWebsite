import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import styles from "./auth.module.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.page}>
      <Link href="/" aria-label="Back to the home page">
        <Logo />
      </Link>
      <div className={styles.card}>{children}</div>
    </main>
  );
}
