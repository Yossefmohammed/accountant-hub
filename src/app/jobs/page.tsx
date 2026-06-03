import { Suspense } from "react";
import { JobCard } from "@/components/JobCard";
import { JobFilters } from "@/components/JobFilters";
import { Pagination } from "@/components/Pagination";
import { listJobs } from "@/lib/jobs";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function queryString(
  params: Record<string, string | string[] | undefined>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const query = queryString(raw);
  const result = await listJobs(query);
  const categories = await prisma.jobCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1>Find your next accounting project</h1>
          <p>
            Browse open jobs from companies worldwide. Submit a competitive bid
            and grow your freelance practice.
          </p>
        </div>
      </section>

      <div className={`container ${styles.content}`}>
        <Suspense fallback={<div className={styles.filtersLoading}>Loading filters…</div>}>
          <JobFilters categories={categories} />
        </Suspense>

        <p className={styles.count}>
          {result.meta.total} job{result.meta.total === 1 ? "" : "s"} found
        </p>

        {result.data.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs match your filters</h3>
            <p>Try adjusting search, category, or budget range.</p>
            <a href="/jobs" className="btn btn-primary">
              View all jobs
            </a>
          </div>
        ) : (
          <div className={styles.grid}>
            {result.data.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  deadline: job.deadline.toISOString(),
                  postedAt: job.postedAt.toISOString(),
                }}
              />
            ))}
          </div>
        )}

        <Pagination
          page={result.meta.page}
          totalPages={result.meta.totalPages}
          searchParams={query}
        />
      </div>
    </div>
  );
}
