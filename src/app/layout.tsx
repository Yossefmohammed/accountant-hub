import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accountant Hub — Find Accounting Jobs",
  description:
    "Browse accounting jobs and submit bids as a freelance accountant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>Accountant Hub — Built for the Vibe Coder assessment</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
