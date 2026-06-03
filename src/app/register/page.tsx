import { RegisterForm } from "@/components/AuthForm";
import styles from "../auth/auth.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Create your account</h1>
        <p className={styles.subtitle}>
          Join Accountant Hub and start bidding on projects.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
