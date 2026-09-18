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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <div className="text-sm font-semibold text-blue-700">Loading users…</div>
        </div>
      </div>
    );

  const pending = users.filter((u) => !u.approved);
  const approved = users.filter((u) => u.approved);

  const badgeStyle = (role: string, approved: boolean): React.CSSProperties => ({
    display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: !approved ? "#fef2f2" : role === "ADMIN" ? "#e8f0ff" : "#f0fdf4",
    color: !approved ? "#dc2626" : role === "ADMIN" ? "#0052cc" : "#16a34a",
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* ── Nav bar ── */}
      <div className="border-b border-blue-800/30 bg-blue-700 text-white shadow-md">
        <div className="mx-auto flex min-h-[68px] max-w-[1400px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <img
            src="/logo.png"
            alt="GWL"
            className="h-10 w-10 rounded-lg object-contain"
          />

          <div className="hidden h-8 w-px bg-white/20 sm:block" />

          <div className="min-w-0">
            <div className="truncate text-sm font-bold sm:text-base">
              Ghana Water Limited
            </div>
            <div className="truncate text-[10px] font-medium text-blue-100 sm:text-xs">
              Ashanti South Region — Admin
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70 sm:px-4"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">

        <div className="mb-7">
          <div className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
            Administration
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            User Management
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Approve registrations and manage staff roles.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 font-bold">
              {message.type === "success" ? "✓" : "⚠"}
            </span>
            {message.text}
          </div>
        )}

        {/* ── Pending Approvals ── */}
        {pending.length > 0 && (
          <div className="mb-7 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 bg-gradient-to-r from-red-700 to-red-500 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-base font-bold text-white">
                  ⏳ Pending Approvals
                </div>
                <div className="mt-1 text-xs text-red-100">
                  Staff registrations awaiting approval
                </div>
              </div>

              <div className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-red-600">
                {pending.length} waiting
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-red-100 bg-red-50/70">
                    {["Staff No.", "Name", "Username", "Registered", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-red-700"
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
                      className={`border-b border-red-50 transition hover:bg-red-50/60 ${
                        idx % 2 === 0 ? "bg-white" : "bg-red-50/20"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-800">
                        {u.staffNo}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                        {u.name}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                        {u.username}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => doAction(u.id, "approve")}
                          disabled={actionLoading === u.id}
                          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading === u.id ? (
                            <>
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Processing
                            </>
                          ) : (
                            "✓ Approve"
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

        {/* ── All Users ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 bg-gradient-to-r from-blue-950 to-blue-700 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-bold text-white">
                All Staff Accounts
              </div>
              <div className="mt-1 text-xs text-blue-100">
                Manage active administrator and staff accounts
              </div>
            </div>

            <div className="w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-50">
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
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-blue-700"
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
                    className={`border-b border-slate-100 transition hover:bg-blue-50/50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-800">
                      {u.staffNo}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                      {u.name}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                      {u.username}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        style={badgeStyle(u.role, u.approved)}
                        className="!rounded-full !px-3 !py-1 !text-[10px] !font-bold"
                      >
                        {u.approved ? "Active" : "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        style={badgeStyle(u.role, u.approved)}
                        className="!rounded-full !px-3 !py-1 !text-[10px] !font-bold"
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {u.role === "USER" ? (
                        <button
                          onClick={() => doAction(u.id, "promote")}
                          disabled={actionLoading === u.id}
                          className="inline-flex items-center rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading === u.id ? "…" : "↑ Make Admin"}
                        </button>
                      ) : (
                        <button
                          onClick={() => doAction(u.id, "demote")}
                          disabled={actionLoading === u.id || u.staffNo === (session?.user as any)?.staffNo}
                          className={`inline-flex items-center rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-600 transition hover:border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                            u.staffNo === (session?.user as any)?.staffNo
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {actionLoading === u.id ? "…" : "↓ Remove Admin"}
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
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                👥
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