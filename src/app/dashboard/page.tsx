import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { formatBudget, formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?from=/dashboard");

  const bids = await prisma.bid.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          companyName: true,
          status: true,
          budgetMin: true,
          budgetMax: true,
        },
      },
    },
  });

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <h1>My bids</h1>
            <p>Track proposals you have submitted to open jobs.</p>
          </div>
          <Link href="/jobs" className="btn btn-primary">
            Browse jobs
          </Link>
        </header>

        {bids.length === 0 ? (
          <div className="empty-state">
            <h3>No bids yet</h3>
            <p>
              Find an open job that matches your skills and submit your first
              proposal.
            </p>
            <Link href="/jobs" className="btn btn-primary">
              Explore jobs
            </Link>
          </div>
        ) : (
          <ul className={styles.list}>
            {bids.map((bid) => (
              <li key={bid.id} className={styles.item}>
                <div className={styles.itemTop}>
                  <div>
                    <Link href={`/jobs/${bid.job.id}`} className={styles.title}>
                      {bid.job.title}
                    </Link>
                    <p className={styles.company}>{bid.job.companyName}</p>
                  </div>
                  <span className={`badge badge-${bid.job.status}`}>
                    {bid.job.status}
                  </span>
                </div>

                <dl className={styles.meta}>
                  <div>
                    <dt>Your bid</dt>
                    <dd>{formatCurrency(bid.proposedPrice)}</dd>
                  </div>
                  <div>
                    <dt>Job budget</dt>
                    <dd>
                      {formatBudget(bid.job.budgetMin, bid.job.budgetMax)}
                    </dd>
                  </div>
                  <div>
                    <dt>Delivery</dt>
                    <dd>{bid.estimatedDelivery}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{formatDate(bid.createdAt)}</dd>
                  </div>
                </dl>

                <p className={styles.excerpt}>{bid.coverLetter}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
