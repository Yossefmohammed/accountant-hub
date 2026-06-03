"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import styles from "./Header.module.css";

type User = { id: number; name: string; email: string };

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    apiFetch<{ user: User | null }>("/api/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/jobs");
    router.refresh();
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/jobs" className={styles.logo}>
          <span className={styles.logoMark}>AH</span>
          <span>Accountant Hub</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/jobs">Browse Jobs</Link>
          {user && <Link href="/dashboard">My Bids</Link>}
        </nav>

        <div className={styles.actions}>
          {user === undefined ? (
            <span className={styles.muted}>…</span>
          ) : user ? (
            <>
              <span className={styles.userName}>Hi, {user.name.split(" ")[0]}</span>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
