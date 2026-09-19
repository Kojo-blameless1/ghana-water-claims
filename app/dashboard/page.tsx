"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Voucher = {
  id: number;
  employee: string;
  date: string;
  totalAmount: number;
  allowanceMonth: string;
  createdAt: string;
};

/* Presentational icon set — inline SVG, no new dependency required.
   Swap for lucide-react equivalents if that package is already installed. */
function IconPlane({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 16l20-8-8 20-3-9-9-3z" />
    </svg>
  );
}

function IconClock({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function IconDocument({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function IconArrowRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      if ((session.user as any)?.role === "ADMIN") router.push("/admin");
      else fetchVouchers();
    }
  }, [status]);

  const fetchVouchers = async () => {
    const res = await fetch("/api/travel-voucher/mine");
    const data = await res.json();
    setVouchers(data);
    setLoading(false);
  };

  if (status === "loading" || loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="font-semibold text-blue-900">Loading…</div>
      </div>
    );

  const user = session?.user as any;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Nav bar ── */}
      <div className="flex h-[60px] items-center gap-4 bg-blue-900 px-8">
        <img src="/logo.png" alt="GWL" className="h-9 w-9 rounded object-contain" />
        <div className="h-7 w-px bg-white/25" />
        <div>
          <div className="text-sm font-semibold text-white">Ghana Water Limited</div>
          <div className="text-[11px] text-white/65">Ashanti South Region</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <div className="text-[13px] font-semibold text-white">{user?.name}</div>
            <div className="text-[11px] text-white/60">Staff No: {user?.staffNo}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-blue-900"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="bg-blue-900 px-8 py-10">
        <div className="text-xs font-bold uppercase tracking-[0.15em] text-blue-200">
          Staff Portal
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[26px]">
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-2 text-[13px] text-blue-100">
          Submit travel vouchers and track your claims below.
        </p>
      </div>

      <div className="mx-auto max-w-[900px] px-6 py-8 pb-16">
        {/* ── Action Cards ── */}
        <div className="mb-9">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-900">
            Quick Actions
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Link href="/travel-voucher/new" className="block no-underline">
              <div className="h-full rounded-xl border border-slate-200 border-t-4 border-t-blue-900 bg-white p-6 shadow-sm transition-colors duration-150 hover:border-slate-300 hover:border-t-blue-900">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                  <IconPlane className="h-5 w-5 text-blue-900" />
                </div>
                <div className="mb-1.5 text-base font-semibold text-slate-900">
                  Travel Expense Voucher
                </div>
                <p className="mb-4 text-[13px] leading-relaxed text-slate-600">
                  Submit a new travel claim with expenses and itinerary. Prints as two pages.
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-[7px] text-xs font-semibold text-white">
                  New Voucher
                  <IconArrowRight />
                </div>
              </div>
            </Link>

            {/* Overtime — coming soon */}
            <div className="rounded-xl border border-slate-200 border-t-4 border-t-slate-300 bg-white p-6 opacity-60 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                <IconClock className="h-5 w-5 text-slate-500" />
              </div>
              <div className="mb-1.5 text-base font-semibold text-slate-900">
                Overtime Claim
              </div>
              <p className="mb-4 text-[13px] leading-relaxed text-slate-600">
                Submit overtime hours for approval.
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-400 px-4 py-[7px] text-xs font-semibold text-white">
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* ── My Vouchers ── */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-blue-900 px-5 py-3.5">
            <div className="text-sm font-semibold text-white">My Travel Vouchers</div>
            <div className="text-[11px] text-blue-200">{vouchers.length} total</div>
          </div>

          {vouchers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50">
                <IconDocument className="h-6 w-6 text-slate-400" />
              </div>
              <div className="text-sm text-slate-600">No vouchers submitted yet.</div>
              <div className="mt-1 text-[13px] text-slate-400">
                Create your first travel voucher above.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50">
                    {["#", "Month", "Date", "Total (GH¢)", "Action"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-blue-900"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v, idx) => (
                    <tr
                      key={v.id}
                      className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                    >
                      <td className="px-4 py-3 font-semibold tabular-nums text-blue-900">
                        #{v.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {v.allowanceMonth}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {v.date || new Date(v.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold tabular-nums text-blue-900">
                        GH¢ {v.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/travel-voucher/${v.id}`}
                          className="inline-block rounded-md bg-blue-900 px-3.5 py-[5px] text-xs font-semibold text-white no-underline transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
                        >
                          View &amp; Print
                        </Link>
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