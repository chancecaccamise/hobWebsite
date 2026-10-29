import Link from "next/link";
import { Suspense } from "react";
import { getContactCounts, listContactSubmissions } from "@/lib/contact";
import { getSubscriberCounts, listSubscribers } from "@/lib/subscribers";
import { formatDateTime } from "./_components/format";
import styles from "./admin.module.css";

const RECENT_COUNT = 5;

export default function DashboardPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>A quick look at signups and messages.</p>
        </div>
      </header>
      <Suspense fallback={<p className={styles.muted}>Loading…</p>}>
        <Overview />
      </Suspense>
    </>
  );
}

async function Overview() {
  const [subscriberCounts, contactCounts, recentSubscribers, recentMessages] = await Promise.all([
    getSubscriberCounts(),
    getContactCounts(),
    listSubscribers(1, RECENT_COUNT),
    listContactSubmissions("all", 1, RECENT_COUNT),
  ]);

  const stats = [
    { label: "Email signups", value: subscriberCounts.total, href: "/admin/email-list" },
    { label: "New signups this week", value: subscriberCounts.lastWeek, href: "/admin/email-list" },
    { label: "Unread messages", value: contactCounts.unread, href: "/admin/contact?status=unread" },
    { label: "Total messages", value: contactCounts.all, href: "/admin/contact" },
  ];

  return (
    <>
      <div className={styles.stats}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className={styles.stat}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value.toLocaleString("en-US")}</span>
          </Link>
        ))}
      </div>

      <div className={styles.panels}>
        <section className={styles.card}>
          <header className={styles.panelHeader}>
            <h2>Latest signups</h2>
            <Link href="/admin/email-list">View all</Link>
          </header>
          {recentSubscribers.subscribers.length === 0 ? (
            <p className={styles.empty}>No signups yet.</p>
          ) : (
            <ul className={styles.panelList}>
              {recentSubscribers.subscribers.map((subscriber) => (
                <li key={subscriber.id}>
                  <span className={styles.primaryText}>{subscriber.email}</span>
                  <span className={styles.secondaryText}>{formatDateTime(subscriber.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <header className={styles.panelHeader}>
            <h2>Latest messages</h2>
            <Link href="/admin/contact">View all</Link>
          </header>
          {recentMessages.submissions.length === 0 ? (
            <p className={styles.empty}>No messages yet.</p>
          ) : (
            <ul className={styles.panelList}>
              {recentMessages.submissions.map((submission) => (
                <li key={submission.id}>
                  <Link href={`/admin/contact/${submission.id}`} className={styles.panelLink}>
                    <span className={styles.primaryText}>
                      {submission.readAt === null && <span className={styles.dot} />}
                      {submission.name}
                    </span>
                    <span className={styles.preview}>
                      {submission.subject || submission.message}
                    </span>
                  </Link>
                  <span className={styles.secondaryText}>{formatDateTime(submission.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
