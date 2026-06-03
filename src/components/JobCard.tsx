import Link from "next/link";
import { formatBudget, formatDate, formatRelative } from "@/lib/format";
import styles from "./JobCard.module.css";

export type JobCardData = {
  id: number;
  title: string;
  companyName: string;
  shortDescription: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: string;
  category: string;
  bidsCount: number;
  postedAt: string;
};

export function JobCard({ job }: { job: JobCardData }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className={styles.category}>{job.category}</span>
        <span className={`badge badge-${job.status}`}>{job.status}</span>
      </div>

      <Link href={`/jobs/${job.id}`} className={styles.title}>
        <h2>{job.title}</h2>
      </Link>

      <p className={styles.company}>{job.companyName}</p>
      <p className={styles.desc}>{job.shortDescription}</p>

      <dl className={styles.meta}>
        <div>
          <dt>Budget</dt>
          <dd>{formatBudget(job.budgetMin, job.budgetMax)}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{formatDate(job.deadline)}</dd>
        </div>
        <div>
          <dt>Bids</dt>
          <dd>{job.bidsCount}</dd>
        </div>
        <div>
          <dt>Posted</dt>
          <dd>{formatRelative(job.postedAt)}</dd>
        </div>
      </dl>

      <Link href={`/jobs/${job.id}`} className={styles.link}>
        View details →
      </Link>
    </article>
  );
}
