import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/(auth)/actions";
import { siteConfig } from "@/config/site";
import { getAdminSession } from "@/lib/auth";
import { getContactCounts } from "@/lib/contact";
import { LogOutIcon } from "./_components/icons";
import { SidebarNav } from "./_components/SidebarNav";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: `Admin — ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>
          Admin
          <span className={styles.brandSite}>{siteConfig.name}</span>
        </Link>
        <SidebarNav
          contactBadge={
            <Suspense>
              <UnreadBadge />
            </Suspense>
          }
        />
        <Suspense>
          <Account />
        </Suspense>
      </aside>

      <div className={styles.content}>
        <Suspense fallback={<p className={styles.muted}>Loading…</p>}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </div>
    </div>
  );
}

// Shows a holding screen to accounts that haven't been granted access. The
// database policies are what actually protect the data.
async function AdminGate({ children }: { children: React.ReactNode }) {
  const { isAdmin } = await getAdminSession();
  if (isAdmin) return children;

  return (
    <section className={styles.pending}>
      <h1 className={styles.title}>Waiting for access</h1>
      <p className={styles.subtitle}>
        Your account is set up, but it hasn&apos;t been given admin access yet. Ask an
        existing admin to grant it, then refresh this page.
      </p>
    </section>
  );
}

async function UnreadBadge() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) return null;

  const { unread } = await getContactCounts();
  if (unread === 0) return null;
  return (
    <span className={styles.navBadge} aria-label={`${unread} unread`}>
      {unread > 99 ? "99+" : unread}
    </span>
  );
}

async function Account() {
  const { email } = await getAdminSession();
  return (
    <div className={styles.account}>
      <span className={styles.accountEmail} title={email}>
        {email}
      </span>
      <form action={signOut}>
        <button type="submit" className={styles.signOut}>
          <LogOutIcon />
          Sign out
        </button>
      </form>
    </div>
  );
}
