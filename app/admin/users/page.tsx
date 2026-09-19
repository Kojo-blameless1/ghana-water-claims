"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: number;
  staffNo: string;
  name: string;
  username: string;
  role: string;
  approved: boolean;
  createdAt: string;
};

/* Presentational icons — inline SVG, no new dependency required.
   Swap for lucide-react equivalents if that package is already installed. */
function IconCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 10.5l3.5 3.5L15 6.5" />
    </svg>
  );
}

function IconWarning({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l6.28 11.18c.75 1.334-.213 2.987-1.743 2.987H3.72c-1.53 0-2.493-1.653-1.743-2.987l6.28-11.18zM10 7a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 7zm0 8a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconClock({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function IconUsers({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconArrowLeft({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function IconArrowUp({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function IconArrowDown({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      if ((session.user as any)?.role !== "ADMIN") router.push("/dashboard");
      else fetchUsers();
    }
  }, [status]);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const doAction = async (userId: number, action: string) => {
    setActionLoading(userId);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ text: data.message, type: "success" });
      fetchUsers();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-900" />
          <div className="text-sm font-semibold text-slate-600">Loading users…</div>
        </div>
      </div>
    );

  const pending = users.filter((u) => !u.approved);
  const approved = users.filter((u) => u.approved);

  // Same conditional logic as the original badgeStyle(role, approved) helper —
  // now returns Tailwind classes instead of a CSSProperties object.
  // The `!approved` branch is unreachable with current callers (only ever
  // invoked on rows from `approved`), same as in the original file — kept
  // as-is rather than removed, per your instruction to flag rather than delete.
  const badgeClass = (role: string, approvedFlag: boolean) => {
    if (!approvedFlag) return "bg-red-50 text-red-600";
    if (role === "ADMIN") return "bg-blue-50 text-blue-900";
    return "bg-emerald-50 text-emerald-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* ── Nav bar — matches AdminDashboard: white bg, slate-200 border ── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[68px] max-w-[1400px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <img
            src="/logo.png"
            alt="GWL"
            className="h-10 w-10 rounded-lg object-contain"
          />

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900 sm:text-base">
              Ghana Water Limited
            </div>
            <div className="truncate text-[10px] font-medium text-slate-500 sm:text-xs">
              Ashanti South Region — Admin
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-900 sm:px-4"
            >
              <IconArrowLeft />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hero — matches AdminDashboard: white bg, amber tag, same heading scale ── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
              Administration
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              User Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Approve registrations and manage staff roles.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {message && (
          <div
            role="status"
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 ${
                message.type === "success" ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {message.type === "success" ? <IconCheck className="h-3.5 w-3.5" /> : <IconWarning className="h-3.5 w-3.5" />}
            </span>
            {message.text}
          </div>
        )}

        {/* ── Pending Approvals — header now matches AdminDashboard's
             card-header pattern (bg-slate-50, dark title, count pill)
             instead of a solid amber banner; amber is kept only as an
             accent (icon chip + count pill), same rule as elsewhere. ── */}
        {pending.length > 0 && (
          <div className="mb-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <IconClock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900">
                    Pending Approvals
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    Staff registrations awaiting approval
                  </div>
                </div>
              </div>

              <div className="w-fit rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                {pending.length} waiting
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {["Staff No.", "Name", "Username", "Registered", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-blue-900"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {pending.map((u, idx) => (
                    <tr
                      key={u.id}
                      className={`border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                        {u.staffNo}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                        {u.name}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {u.username}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => doAction(u.id, "approve")}
                          disabled={actionLoading === u.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading === u.id ? (
                            <>
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Processing
                            </>
                          ) : (
                            <>
                              <IconCheck className="h-3.5 w-3.5" />
                              Approve
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── All Users — header now matches AdminDashboard's card-header
             pattern exactly (bg-slate-50, dark title, neutral count pill)
             instead of a solid blue-900 banner. ── */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-semibold text-slate-900">
                All Staff Accounts
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Manage active administrator and staff accounts
              </div>
            </div>

            <div className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
              {approved.length} active
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {["Staff No.", "Name", "Username", "Status", "Role", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-blue-900"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {approved.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                      {u.staffNo}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                      {u.name}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {u.username}
                    </td>

                    <td className="px-4 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold ${badgeClass(u.role, u.approved)}`}>
                        {u.approved ? "Active" : "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold ${badgeClass(u.role, u.approved)}`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {u.role === "USER" ? (
                        <button
                          onClick={() => doAction(u.id, "promote")}
                          disabled={actionLoading === u.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-900 transition-colors duration-150 hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading === u.id ? "…" : (
                            <>
                              <IconArrowUp />
                              Make Admin
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => doAction(u.id, "demote")}
                          disabled={actionLoading === u.id || u.staffNo === (session?.user as any)?.staffNo}
                          className={`inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-600 transition-colors duration-150 hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                            u.staffNo === (session?.user as any)?.staffNo
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {actionLoading === u.id ? "…" : (
                            <>
                              <IconArrowDown />
                              Remove Admin
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {approved.length === 0 && (
            <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50">
                <IconUsers className="h-6 w-6 text-slate-400" />
              </div>
              <div className="text-sm font-medium text-slate-500">
                No active staff accounts.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}