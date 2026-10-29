import Link from "next/link";
import { Suspense } from "react";
import {
  getContactCounts,
  listContactSubmissions,
  type ContactStatus,
} from "@/lib/contact";
import { ConfirmButton } from "../_components/ConfirmButton";
import { formatDateTime, parsePage } from "../_components/format";
import { CheckCheckIcon, CheckIcon, MailIcon, TrashIcon } from "../_components/icons";
import { Pagination } from "../_components/Pagination";
import { deleteSubmission, markAllRead, setRead } from "./actions";
import styles from "../admin.module.css";

const PAGE_SIZE = 25;
const STATUSES: { value: ContactStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export default function ContactPage({ searchParams }: PageProps<"/admin/contact">) {
  return (
    <Suspense fallback={<p className={styles.muted}>Loading…</p>}>
      <ContactInbox searchParams={searchParams} />
    </Suspense>
  );
}

async function ContactInbox({ searchParams }: Pick<PageProps<"/admin/contact">, "searchParams">) {
  const params = await searchParams;
  const status = STATUSES.find((s) => s.value === params.status)?.value ?? "all";
  const page = parsePage(params.page);

  const [counts, { submissions, total }] = await Promise.all([
    getContactCounts(),
    listContactSubmissions(status, page, PAGE_SIZE),
  ]);
  const statusHref = (value: ContactStatus) =>
    value === "all" ? "/admin/contact" : `/admin/contact?status=${value}`;

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.subtitle}>Messages sent through the website&apos;s contact form.</p>
        </div>
        <form action={markAllRead}>
          <button type="submit" className={styles.outlineButton} disabled={counts.unread === 0}>
            <CheckCheckIcon />
            Mark all read
          </button>
        </form>
      </header>

      <div className={styles.filters}>
        <span className={styles.filtersLabel}>Status</span>
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={statusHref(s.value)}
            className={styles.filterChip}
            aria-current={s.value === status ? "page" : undefined}
          >
            {s.label} <span className={styles.filterCount}>{counts[s.value]}</span>
          </Link>
        ))}
      </div>

      <div className={styles.card}>
        {submissions.length === 0 ? (
          <p className={styles.empty}>
            {status === "unread"
              ? "You're all caught up."
              : page > 1
                ? "No messages on this page."
                : "No messages yet."}
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Sender</th>
                  <th scope="col">Message</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Submitted</th>
                  <th scope="col" className={styles.actionsCol}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => {
                  const isRead = submission.readAt !== null;
                  return (
                    <tr key={submission.id} className={isRead ? undefined : styles.unreadRow}>
                      <td>
                        <span className={styles.status}>
                          <span className={isRead ? styles.dotRead : styles.dot} />
                          {isRead ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.primaryText}>{submission.name}</div>
                        <div className={styles.secondaryText}>{submission.email}</div>
                      </td>
                      <td className={styles.subjectCell}>
                        <Link href={`/admin/contact/${submission.id}`} className={styles.rowLink}>
                          {submission.subject && (
                            <div className={styles.primaryText}>{submission.subject}</div>
                          )}
                          <div className={submission.subject ? styles.preview : styles.messagePreview}>
                            {submission.message}
                          </div>
                        </Link>
                      </td>
                      <td className={styles.nowrap}>{submission.phone ?? "—"}</td>
                      <td className={styles.nowrap}>{formatDateTime(submission.createdAt)}</td>
                      <td>
                        <div className={styles.rowActions}>
                          <form action={setRead.bind(null, submission.id, !isRead)}>
                            <button
                              type="submit"
                              className={styles.iconButton}
                              title={isRead ? "Mark as unread" : "Mark as read"}
                              aria-label={isRead ? "Mark as unread" : "Mark as read"}
                            >
                              {isRead ? <MailIcon /> : <CheckIcon />}
                            </button>
                          </form>
                          <form action={deleteSubmission.bind(null, submission.id, false)}>
                            <ConfirmButton
                              confirmMessage={`Delete the message from ${submission.name}? This can't be undone.`}
                              className={`${styles.iconButton} ${styles.danger}`}
                              title="Delete"
                              aria-label="Delete"
                            >
                              <TrashIcon />
                            </ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        href={(p) => `${statusHref(status)}${status === "all" ? "?" : "&"}page=${p}`}
      />
    </>
  );
}
