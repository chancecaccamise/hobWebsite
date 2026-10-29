import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getContactSubmission } from "@/lib/contact";
import { ConfirmButton } from "../../_components/ConfirmButton";
import { formatDateTime } from "../../_components/format";
import { ArrowLeftIcon, MailIcon, ReplyIcon, TrashIcon } from "../../_components/icons";
import { deleteSubmission, markUnreadAndReturn } from "../actions";
import { MarkReadOnView } from "../MarkReadOnView";
import styles from "../../admin.module.css";

export default function ContactMessagePage({ params }: PageProps<"/admin/contact/[id]">) {
  return (
    <>
      <Link href="/admin/contact" className={styles.backLink}>
        <ArrowLeftIcon />
        All messages
      </Link>
      <Suspense fallback={<p className={styles.muted}>Loading…</p>}>
        <Message params={params} />
      </Suspense>
    </>
  );
}

async function Message({ params }: Pick<PageProps<"/admin/contact/[id]">, "params">) {
  const { id } = await params;
  const submission = await getContactSubmission(id);
  if (!submission) notFound();

  const replySubject = `Re: ${submission.subject || `Your message to us`}`;
  const replyHref = `mailto:${submission.email}?subject=${encodeURIComponent(replySubject)}`;

  return (
    <article className={styles.card}>
      {submission.readAt === null && <MarkReadOnView id={submission.id} />}

      <header className={styles.messageHeader}>
        <div>
          <h1 className={styles.messageTitle}>
            {submission.subject || `Message from ${submission.name}`}
          </h1>
          <p className={styles.secondaryText}>{formatDateTime(submission.createdAt)}</p>
        </div>
        <div className={styles.messageActions}>
          <a href={replyHref} className={styles.primaryButton}>
            <ReplyIcon />
            Reply
          </a>
          <form action={markUnreadAndReturn.bind(null, submission.id)}>
            <button type="submit" className={styles.outlineButton}>
              <MailIcon />
              Mark unread
            </button>
          </form>
          <form action={deleteSubmission.bind(null, submission.id, true)}>
            <ConfirmButton
              confirmMessage={`Delete the message from ${submission.name}? This can't be undone.`}
              className={`${styles.outlineButton} ${styles.danger}`}
            >
              <TrashIcon />
              Delete
            </ConfirmButton>
          </form>
        </div>
      </header>

      <dl className={styles.messageMeta}>
        <div>
          <dt>From</dt>
          <dd>{submission.name}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${submission.email}`}>{submission.email}</a>
          </dd>
        </div>
        {submission.phone && (
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${submission.phone.replace(/[^\d+]/g, "")}`}>{submission.phone}</a>
            </dd>
          </div>
        )}
        {submission.inquiryType && (
          <div>
            <dt>Inquiry</dt>
            <dd>{submission.inquiryType}</dd>
          </div>
        )}
      </dl>

      <p className={styles.messageBody}>{submission.message}</p>
    </article>
  );
}
