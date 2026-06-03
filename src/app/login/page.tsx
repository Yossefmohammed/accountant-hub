import { LoginForm } from "@/components/AuthForm";
import styles from "../auth/auth.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Welcome back</h1>
        <p className={styles.subtitle}>Log in to submit bids on accounting jobs.</p>
        <LoginForm />
      </div>
    </div>
  );
}
