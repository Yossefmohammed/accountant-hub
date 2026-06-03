"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClientError, apiFetch } from "@/lib/api";
import styles from "./BidForm.module.css";

export function BidForm({
  jobId,
  budgetMax,
  onSuccess,
}: {
  jobId: number;
  budgetMax: number;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const form = new FormData(e.currentTarget);

    try {
      await apiFetch(`/api/jobs/${jobId}/bids`, {
        method: "POST",
        body: JSON.stringify({
          proposedPrice: form.get("proposedPrice"),
          estimatedDelivery: form.get("estimatedDelivery"),
          coverLetter: form.get("coverLetter"),
          experienceSummary: form.get("experienceSummary"),
        }),
      });
      onSuccess();
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError(err instanceof Error ? err.message : "Failed to submit bid");
      }
    } finally {
      setLoading(false);
    }
  }

  function err(name: string) {
    return fieldErrors[name]?.[0];
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div>
        <label className="label" htmlFor="proposedPrice">
          Proposed price ($)
        </label>
        <input
          id="proposedPrice"
          name="proposedPrice"
          className="input"
          type="number"
          min={1}
          max={budgetMax * 2}
          step={1}
          required
          placeholder={`Up to ~${budgetMax}`}
        />
        {err("proposedPrice") && (
          <p className="field-error">{err("proposedPrice")}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="estimatedDelivery">
          Estimated delivery time
        </label>
        <input
          id="estimatedDelivery"
          name="estimatedDelivery"
          className="input"
          required
          placeholder="e.g. 2 weeks"
        />
        {err("estimatedDelivery") && (
          <p className="field-error">{err("estimatedDelivery")}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="coverLetter">
          Cover letter / proposal
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          className="textarea"
          rows={5}
          required
          minLength={20}
          placeholder="Explain why you're the right fit for this job…"
        />
        {err("coverLetter") && (
          <p className="field-error">{err("coverLetter")}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="experienceSummary">
          Relevant experience summary
        </label>
        <textarea
          id="experienceSummary"
          name="experienceSummary"
          className="textarea"
          rows={3}
          required
          placeholder="CPA, 5+ years bookkeeping, etc."
        />
        {err("experienceSummary") && (
          <p className="field-error">{err("experienceSummary")}</p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Submitting…" : "Submit bid"}
      </button>
    </form>
  );
}
