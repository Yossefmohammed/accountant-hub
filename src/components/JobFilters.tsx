"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "./JobFilters.module.css";

type Category = { id: number; name: string };

export function JobFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [budgetMin, setBudgetMin] = useState(searchParams.get("budgetMin") || "");
  const [budgetMax, setBudgetMax] = useState(searchParams.get("budgetMax") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  function applyFilters(e?: FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (budgetMin) params.set("budgetMin", budgetMin);
    if (budgetMax) params.set("budgetMax", budgetMax);
    if (status) params.set("status", status);
    if (sort && sort !== "newest") params.set("sort", sort);
    params.set("page", "1");
    router.push(`/jobs?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setBudgetMin("");
    setBudgetMax("");
    setStatus("");
    setSort("newest");
    router.push("/jobs");
  }

  return (
    <form className={styles.filters} onSubmit={applyFilters}>
      <div className={styles.searchRow}>
        <input
          className="input"
          type="search"
          placeholder="Search by job title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search jobs"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>

      <div className={styles.grid}>
        <div>
          <label className="label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="budgetMin">
            Min budget ($)
          </label>
          <input
            id="budgetMin"
            className="input"
            type="number"
            min={0}
            placeholder="e.g. 1000"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="budgetMax">
            Max budget ($)
          </label>
          <input
            id="budgetMax"
            className="input"
            type="number"
            min={0}
            placeholder="e.g. 5000"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="budget">Highest budget</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary">
          Apply filters
        </button>
        <button type="button" className="btn btn-outline" onClick={clearFilters}>
          Clear
        </button>
      </div>
    </form>
  );
}
