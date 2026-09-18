"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ staffNo: "", name: "", username: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffNo: form.staffNo, name: form.name, username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[400px] rounded-xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-200">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-7 w-7 text-blue-900"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10.5l3.5 3.5L15 6.5" />
            </svg>
          </div>

          <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
            Registration Submitted
          </h2>

          <p className="mb-7 text-sm text-slate-600 leading-relaxed">
            Your account is pending admin approval. You will be able to log in once approved.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-lg bg-blue-900 px-0 py-[11px] text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <div className="flex h-[60px] items-center gap-4 bg-blue-900 px-8">
        <img src="/logo.png" alt="GWL" className="h-9 w-9 object-contain" />
        <div className="h-7 w-px bg-white/25" />
        <div className="text-sm font-semibold text-white">Ghana Water Limited</div>
        <div className="mt-0.5 text-[11px] text-white/60">Ashanti South Region</div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[460px] rounded-xl border border-slate-200 bg-white px-10 py-12 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Create Account
            </h1>
            <p className="mt-1.5 text-[13px] text-slate-600">
              Register with your GWL staff details
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3.5 grid grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="staffNo"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Staff Number
                </label>
                <input
                  id="staffNo"
                  value={form.staffNo}
                  onChange={(e) => update("staffNo", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-[11px] text-sm text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  placeholder="e.g. GWL-0042"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-[11px] text-sm text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="mb-3.5">
              <label
                htmlFor="username"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
              >
                Username
              </label>
              <input
                id="username"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-[11px] text-sm text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-[11px] text-sm text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-[11px] text-sm text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l6.28 11.18c.75 1.334-.213 2.987-1.743 2.987H3.72c-1.53 0-2.493-1.653-1.743-2.987l6.28-11.18zM10 7a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 7zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-900 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? "Submitting…" : "Register"}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-900 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-900/20"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}