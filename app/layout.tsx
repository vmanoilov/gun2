import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Navbar } from "../components/navbar";
import { Toasts } from "../components/toast";

export const metadata: Metadata = {
  title: "GauntletFuse | Multi-LLM Orchestration",
  description: "Debate, critique, and fuse multiple LLM outputs with full auditability."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container-layout py-8">{children}</main>
        <Toasts />
      </body>
    </html>
  );
}
