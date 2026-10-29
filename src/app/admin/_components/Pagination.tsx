import Link from "next/link";
import styles from "../admin.module.css";

export function Pagination({
  page,
  total,
  pageSize,
  href,
}: {
  page: number;
  total: number;
  pageSize: number;
  href: (page: number) => string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (page === 1 && pageCount === 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Pages">
      {page > 1 ? <Link href={href(page - 1)}>← Newer</Link> : <span />}
      <span>
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? <Link href={href(page + 1)}>Older →</Link> : <span />}
    </nav>
  );
}
