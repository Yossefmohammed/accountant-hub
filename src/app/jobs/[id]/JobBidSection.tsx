"use client";

import Link from "next/link";
import { useState } from "react";
import { BidForm } from "@/components/BidForm";
import styles from "./page.module.css";

type Job = {
  id: number;
  title: string;
  status: string;
  budgetMax: number;
};

export function JobBidSection({
  job,
  isLoggedIn,
  userHasBid,
}: {
  job: Job;
  isLoggedIn: boolean;
  userHasBid: boolean;
}) {
  const [submitted, setSubmitted] = useState(userHasBid);
  const [justSubmitted, setJustSubmitted] = useState(false);

  if (job.status !== "open") {
    return (
      <div className={styles.bidPanel}>
        <h2>Apply for this job</h2>
        <p className={styles.closedNote}>
          This job is closed and no longer accepting bids.
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.bidPanel}>
        <h2>Apply for this job</h2>
        <p className={styles.loginPrompt}>
          Sign in to submit your bid for this position.
        </p>
        <div className={styles.bidActions}>
          <Link href="/login" className="btn btn-primary">
            Log in
          </Link>
          <Link href="/register" className="btn btn-outline">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.bidPanel}>
        <h2>Apply for this job</h2>
        <div className="alert alert-success">
          {justSubmitted
            ? "Your bid was submitted successfully!"
            : "You have already submitted a bid for this job."}
        </div>
        <Link href="/dashboard" className="btn btn-outline">
          View my bids
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.bidPanel}>
      <h2>Submit your bid</h2>
      <BidForm
        jobId={job.id}
        budgetMax={job.budgetMax}
        onSuccess={() => {
          setJustSubmitted(true);
          setSubmitted(true);
        }}
      />
    </div>
  );
}
