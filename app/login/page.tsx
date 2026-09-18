"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";

import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [staffNo, setStaffNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      staffNo,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "Account pending approval") {
        setError("Your account is pending admin approval.");
      } else {
        setError("Invalid staff number or password.");
      }
      return;
    }

    // Redirect based on role — fetch session to check
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="GWL"
              className="h-10 w-10 object-contain"
            />

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-900">
                Ghana Water Limited
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Ashanti South Region
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[430px]">
          {/* Login Card */}
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                <img
                  src="/logo.png"
                  alt="GWL"
                  className="h-11 w-11 object-contain"
                />
              </div>

              <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Sign in with your staff credentials
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label
                  htmlFor="staffNo"
                  className="mb-[7px] block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Staff Number
                </label>

                <input
                  id="staffNo"
                  value={staffNo}
                  onChange={(e) => setStaffNo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  placeholder="e.g. GWL-0042"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-[7px] block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                  placeholder="Your password"
                  required
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] text-red-600"
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
                className="flex w-full items-center justify-center rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="my-7 h-px bg-slate-100" />

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-900 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              >
                Register here
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            Ghana Water Limited • Ashanti South Region
          </p>
        </div>
      </main>
    </div>
  );
}