import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { formatBudget, formatDate } from "@/lib/format";
import { getJobById } from "@/lib/jobs";
import { prisma } from "@/lib/prisma";
import { JobBidSection } from "./JobBidSection";
import styles from "./page.module.css";

type Params = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: Params) {
  const { id } = await params;
  const jobId = parseInt(id, 10);
  if (Number.isNaN(jobId)) notFound();

  const job = await getJobById(jobId);
  if (!job) notFound();

  const user = await getSessionUser();
  let userHasBid = false;
  if (user) {
    const bid = await prisma.bid.findUnique({
      where: { jobId_userId: { jobId, userId: user.id } },
    });
    userHasBid = !!bid;
  }

  const skills = job.requiredSkills.split(",").map((s) => s.trim());

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/jobs" className={styles.back}>
          ← Back to jobs
        </Link>

        <div className={styles.layout}>
          <article className={styles.main}>
            <div className={styles.header}>
              <span className={styles.category}>{job.category}</span>
              <span className={`badge badge-${job.status}`}>{job.status}</span>
            </div>

            <h1>{job.title}</h1>
            <p className={styles.company}>{job.companyName}</p>

            <dl className={styles.stats}>
              <div>
                <dt>Budget</dt>
                <dd>{formatBudget(job.budgetMin, job.budgetMax)}</dd>
              </div>
              <div>
                <dt>Deadline</dt>
                <dd>{formatDate(job.deadline)}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>{job.deliveryTime}</dd>
              </div>
              <div>
                <dt>Bids received</dt>
                <dd>{job.bidsCount}</dd>
              </div>
              <div>
                <dt>Posted</dt>
                <dd>{formatDate(job.postedAt)}</dd>
              </div>
            </dl>

            <section className={styles.section}>
              <h2>Job description</h2>
              <p className={styles.description}>{job.fullDescription}</p>
            </section>

            <section className={styles.section}>
              <h2>Required skills</h2>
              <ul className={styles.skills}>
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Client / company</h2>
              <p>
                <strong>{job.companyName}</strong> is hiring for this
                accounting role. Review the scope above before submitting your
                proposal.
              </p>
            </section>

            {job.attachmentsNote && (
              <section className={styles.section}>
                <h2>Attachments</h2>
                <p className={styles.attachments}>{job.attachmentsNote}</p>
              </section>
            )}
          </article>

          <aside>
            <JobBidSection
              job={{
                id: job.id,
                title: job.title,
                status: job.status,
                budgetMax: job.budgetMax,
              }}
              isLoggedIn={!!user}
              userHasBid={userHasBid}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
