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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: "#0052cc", fontWeight: 600 }}>Loading…</div>
      </div>
    );

  const user = session?.user as any;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Nav bar ── */}
      <div style={{ background: "#0052cc", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <img src="/logo.png" alt="GWL" style={{ height: 36, width: 36, objectFit: "contain", borderRadius: 4 }} />
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>Ashanti South Region</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Staff No: {user?.staffNo}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, #003d99 0%, #0052cc 55%, #1a6bff 100%)", padding: "40px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: "#a8c4ff", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Staff Portal</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
            Welcome, {user?.name?.split(" ")[0]}
          </h1>
          <p style={{ color: "#c0d6ff", fontSize: 13, margin: 0 }}>
            Submit travel vouchers and track your claims below.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* ── Action Cards ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0052cc", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Quick Actions
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            <Link href="/travel-voucher/new" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid #dce7ff", borderTop: "4px solid #0052cc", boxShadow: "0 2px 8px rgba(0,82,204,0.07)", cursor: "pointer" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#e8f0ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>✈️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0a2540", marginBottom: 6 }}>Travel Expense Voucher</div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 16px" }}>
                  Submit a new travel claim with expenses and itinerary. Prints as two pages.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0052cc", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  New Voucher →
                </div>
              </div>
            </Link>

            {/* Overtime — coming soon */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid #dce7ff", borderTop: "4px solid #94a3b8", boxShadow: "0 2px 8px rgba(0,82,204,0.07)", opacity: 0.6 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>⏱️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0a2540", marginBottom: 6 }}>Overtime Claim</div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 16px" }}>
                Submit overtime hours for approval.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#94a3b8", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                Coming Soon
              </div>
            </div>

          </div>
        </div>

        {/* ── My Vouchers ── */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #dce7ff", boxShadow: "0 2px 8px rgba(0,82,204,0.06)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(90deg, #003d99, #0052cc)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>My Travel Vouchers</div>
            <div style={{ fontSize: 11, color: "#a8c4ff" }}>{vouchers.length} total</div>
          </div>

          {vouchers.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>No vouchers submitted yet.</div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Create your first travel voucher above.</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f0f4ff", borderBottom: "2px solid #dce7ff" }}>
                    {["#", "Month", "Date", "Total (GH¢)", "Action"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#0052cc", letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v, idx) => (
                    <tr key={v.id} style={{ borderBottom: "1px solid #f0f4ff", background: idx % 2 === 0 ? "#fff" : "#f8faff" }}>
                      <td style={{ padding: "12px 16px", color: "#0052cc", fontWeight: 700 }}>#{v.id}</td>
                      <td style={{ padding: "12px 16px", color: "#0a2540", fontWeight: 500 }}>{v.allowanceMonth}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{v.date || new Date(v.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#0052cc" }}>
                        GH¢ {v.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Link href={`/travel-voucher/${v.id}`} style={{ background: "#0052cc", color: "#fff", padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                          View & Print
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