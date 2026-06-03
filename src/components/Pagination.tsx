import Link from "next/link";
import styles from "./Pagination.module.css";

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    return `/jobs?${params.toString()}`;
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="btn btn-outline">
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span className={styles.info}>
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="btn btn-outline">
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
