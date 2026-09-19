"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Voucher = {
  id: number;
  employee: string;
  date: string;
  district: string;
  totalAmount: number;
  allowanceMonth: string;
  createdAt: string;
};

type Summary = {
  id: number;
  district: string;
  month: string;
  preparedBy: string;
  createdAt: string;
};

/* Presentational icon set — inline SVG, no new dependency required.
   Swap for lucide-react equivalents if that package is already installed. */
function IconPrinter({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" />
    </svg>
  );
}

function IconEdit({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
    </svg>
  );
}

function IconUsers({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconChart({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="8" width="3" height="10" />
      <rect x="17" y="5" width="3" height="13" />
    </svg>
  );
}

function IconCalendar({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconDocument({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function IconClose({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconMenu({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

/* Mobile nav menu — surfaces "Manage Users" and "New Summary" below the
   md breakpoint, where the inline nav links are hidden. Same outside-click
   pattern as ThreeDotMenu below. */
function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target.closest("[data-mobilenav]")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div data-mobilenav className="relative md:hidden">
      <button
        ref={btnRef}
        onClick={() => setOpen((p) => !p)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors duration-150 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
      >
        <IconMenu className="h-5 w-5" />
      </button>

      {open && (
        <div
          data-mobilenav
          className="absolute right-0 top-full z-50 mt-2 min-w-[190px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10"
        >
          <Link
            href="/admin/users"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
          >
            <IconUsers className="h-4 w-4" />
            Manage Users
          </Link>

          <Link
            href="/summary-claims/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-900 transition-colors duration-150 hover:bg-slate-50"
          >
            <IconChart className="h-4 w-4" />
            New Summary
          </Link>
        </div>
      )}
    </div>
  );
}

function ThreeDotMenu({
  onPrint,
  onEdit,
  onDelete,
}: {
  onPrint: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();

      setPos({
        top: rect.bottom + 4,
        left: rect.right - 140,
      });
    }

    setOpen((p) => !p);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target.closest("[data-threedot]")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div data-threedot className="inline-block">
      <button
        ref={btnRef}
        onClick={handleOpen}
        aria-label="Row actions"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-lg font-bold text-slate-600 shadow-sm transition-colors duration-150 hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
      >
        ⋮
      </button>

      {open && (
        <div
          data-threedot
          className="fixed z-[9999] min-w-[150px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10"
          style={{
            top: pos.top,
            left: pos.left,
          }}
        >
          <button
            onClick={() => {
              onPrint();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 border-b border-slate-100 bg-transparent px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
          >
            <IconPrinter className="h-4 w-4 text-slate-500" />
            Print
          </button>

          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 border-b border-slate-100 bg-transparent px-4 py-3 text-left text-sm font-medium text-blue-900 transition-colors duration-150 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
          >
            <IconEdit className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
          >
            <IconTrash className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "voucher" | "summary";
    id: number;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      if ((session.user as any)?.role !== "ADMIN") router.push("/dashboard");
      else fetchAll();
    }
  }, [status]);

  const fetchAll = async () => {
    const [vRes, sRes] = await Promise.all([
      fetch("/api/travel-voucher/all"),
      fetch("/api/summary-claim/all"),
    ]);

    const [vData, sData] = await Promise.all([vRes.json(), sRes.json()]);
    setVouchers(Array.isArray(vData) ? vData : []);
    setSummaries(Array.isArray(sData) ? sData : []);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const url =
      deleteConfirm.type === "voucher"
        ? `/api/travel-voucher/${deleteConfirm.id}`
        : `/api/summary-claim/${deleteConfirm.id}`;

    await fetch(url, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchAll();
  };

  const filteredVouchers = filterMonth
    ? vouchers.filter((v) =>
        v.allowanceMonth?.toLowerCase().includes(filterMonth.toLowerCase())
      )
    : vouchers;

  if (status === "loading" || loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-900" />
          <div className="text-sm font-semibold text-slate-600">Loading…</div>
        </div>
      </div>
    );

  const user = session?.user as any;

  // NOTE: sectionCard / tableHeader below are unused in the JSX (dead code
  // carried over from the original file) — flagging rather than removing,
  // per your instruction not to delete code that looks unused.
  const sectionCard: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e2e2df",
    boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
    overflow: "hidden",
    marginBottom: 28,
  };

  const tableHeader: React.CSSProperties = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#315f9f",
    letterSpacing: 1,
    textTransform: "uppercase",
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <IconTrash className="h-6 w-6 text-red-600" />
            </div>

            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
                Confirm Delete
              </h2>

              <p className="mb-7 text-sm leading-relaxed text-slate-600">
                Are you sure you want to delete this{" "}
                {deleteConfirm.type === "voucher"
                  ? "travel voucher"
                  : "summary of claims"}
                ? This cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors duration-150 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nav bar */}
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

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/users"
              className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-900 md:flex"
            >
              <IconUsers className="h-4 w-4" />
              Manage Users
            </Link>

            <Link
              href="/summary-claims/new"
              className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-900 md:flex"
            >
              <IconChart className="h-4 w-4" />
              New Summary
            </Link>

            <MobileNavMenu />

            <div className="hidden text-right lg:block">
              <div className="text-sm font-semibold text-slate-800">
                {user?.name}
              </div>
              <div className="text-[11px] text-slate-500">Administrator</div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 sm:px-4"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
              Admin Dashboard
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Claims Overview
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              View, filter, edit, and print all travel vouchers and summary of
              claims.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Vouchers",
              value: vouchers.length,
              icon: <IconDocument className="h-5 w-5 text-blue-900" />,
            },
            {
              label: "Total Summaries",
              value: summaries.length,
              icon: <IconChart className="h-5 w-5 text-blue-900" />,
            },
            {
              label: "This Month",
              value: vouchers.filter((v) =>
                v.allowanceMonth?.includes(
                  new Date().toLocaleString("default", {
                    month: "long",
                  })
                )
              ).length,
              icon: <IconCalendar className="h-5 w-5 text-blue-900" />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-150 hover:border-slate-300 sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100">
                {stat.icon}
              </div>

              <div>
                <div className="text-2xl font-semibold tracking-tight tabular-nums text-slate-900 sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Travel Vouchers */}
        <div className="mb-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-semibold text-slate-900">
                All Travel Vouchers
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Manage submitted travel voucher records
              </div>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  placeholder="Filter by month e.g. June 2026"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                />
              </div>

              {filterMonth && (
                <button
                  onClick={() => setFilterMonth("")}
                  aria-label="Clear filter"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition-colors duration-150 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {filteredVouchers.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50">
                <IconDocument className="h-6 w-6 text-slate-400" />
              </div>

              <div className="text-sm font-medium text-slate-500">
                {filterMonth
                  ? `No vouchers found for "${filterMonth}".`
                  : "No vouchers yet."}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {[
                      "#",
                      "Employee",
                      "District",
                      "Month",
                      "Date",
                      "Total (GH¢)",
                      "",
                    ].map((h) => (
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
                  {filteredVouchers.map((v, idx) => (
                    <tr
                      key={v.id}
                      className={`border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-semibold tabular-nums text-blue-900">
                        #{v.id}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                        {v.employee}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {v.district}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {v.allowanceMonth}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {v.date || new Date(v.createdAt).toLocaleDateString()}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold tabular-nums text-slate-800">
                        GH¢ {v.totalAmount?.toFixed(2)}
                      </td>

                      <td className="px-4 py-4">
                        <ThreeDotMenu
                          onPrint={() =>
                            router.push(`/travel-voucher/${v.id}`)
                          }
                          onEdit={() =>
                            router.push(`/travel-voucher/${v.id}/edit`)
                          }
                          onDelete={() =>
                            setDeleteConfirm({
                              type: "voucher",
                              id: v.id,
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary of Claims */}
        <div className="mb-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-semibold text-slate-900">
                All Summary of Claims
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Review and manage claim summaries
              </div>
            </div>

            <Link
              href="/summary-claims/new"
              className="inline-flex w-fit items-center rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
            >
              + New Summary
            </Link>
          </div>

          {summaries.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50">
                <IconChart className="h-6 w-6 text-slate-400" />
              </div>

              <div className="text-sm font-medium text-slate-500">
                No summaries yet.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {[
                      "#",
                      "District",
                      "Month",
                      "Prepared By",
                      "Date",
                      "",
                    ].map((h) => (
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
                  {summaries.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={`border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-semibold tabular-nums text-blue-900">
                        #{s.id}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                        {s.district}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {s.month}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {s.preparedBy || "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <ThreeDotMenu
                          onPrint={() =>
                            router.push(`/summary-claims/${s.id}`)
                          }
                          onEdit={() =>
                            router.push(`/summary-claims/${s.id}/edit`)
                          }
                          onDelete={() =>
                            setDeleteConfirm({
                              type: "summary",
                              id: s.id,
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}