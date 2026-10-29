import { Suspense } from "react";
import { listSubscribers } from "@/lib/subscribers";
import { formatDateTime, parsePage } from "../_components/format";
import { Pagination } from "../_components/Pagination";
import styles from "../admin.module.css";

const PAGE_SIZE = 50;

export default function EmailListPage({ searchParams }: PageProps<"/admin/email-list">) {
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Email List</h1>
          <p className={styles.subtitle}>People who signed up for launch updates on the home page.</p>
        </div>
      </header>
      <Suspense fallback={<p className={styles.muted}>Loading…</p>}>
        <Subscribers searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Subscribers({ searchParams }: Pick<PageProps<"/admin/email-list">, "searchParams">) {
  const page = parsePage((await searchParams).page);
  const { subscribers, total } = await listSubscribers(page, PAGE_SIZE);

  return (
    <>
      <div className={styles.filters}>
        <span className={styles.filtersLabel}>Total</span>
        <span className={styles.filterChip} aria-current="page">
          {total.toLocaleString("en-US")} {total === 1 ? "signup" : "signups"}
        </span>
      </div>

      <div className={styles.card}>
        {subscribers.length === 0 ? (
          <p className={styles.empty}>{page === 1 ? "No signups yet." : "No signups on this page."}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Email</th>
                  <th scope="col">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td className={styles.primaryText}>{subscriber.email}</td>
                    <td className={styles.nowrap}>{formatDateTime(subscriber.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        href={(p) => `/admin/email-list?page=${p}`}
      />
    </>
  );
}
