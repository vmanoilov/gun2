"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowserClient } from "../../lib/supabase";
import { useToastStore } from "../../stores/use-toast-store";

export default function SignupPage() {
  const router = useRouter();
  const { push } = useToastStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      push({ title: "Email and password required", variant: "error" });
      return;
    }

    if (form.password.length < 6) {
      push({ title: "Password must be at least 6 characters", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabaseBrowserClient.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      push({ title: "Account created successfully! Please check your email to confirm.", variant: "success" });
      router.push("/login" as any);
    } catch (error: any) {
      console.error("Signup error:", error);
      push({ title: error.message || "Signup failed", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
              <p className="text-xs text-gray-600 mt-1">Must be at least 6 characters</p>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}