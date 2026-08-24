"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

type Voucher = {
  id: number; employee: string; date: string;
  totalAmount: number; allowanceMonth: string; tripType: string; createdAt: string;
};

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const res = await api("/api/auth/me");
      if (!res.ok) { router.push("/login"); return; }
      const data = await res.json();
      if (data.user?.role === "ADMIN") { router.push("/admin"); return; }
      setUser(data.user);
      const vRes = await api("/api/vouchers/mine");
      const vData = await vRes.json();
      setVouchers(Array.isArray(vData) ? vData : []);
      setLoading(false);
    };
    init();
  }, []);

  const handleSignOut = async () => {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ color: "#1d4ed8", fontWeight: 600 }}>Loading…</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Nav */}
      <div style={{ background: "#1d4ed8", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <img src="/logo.png" alt="GWL" style={{ height: 34, objectFit: "contain" }} />
        <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.2)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Ashanti South Region</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Staff No: {user?.staffNo}</div>
          </div>
          <button onClick={handleSignOut} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)", padding: "36px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, color: "#bfdbfe", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Staff Portal</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Welcome, {user?.name?.split(" ")[0]}</h1>
          <p style={{ color: "#bfdbfe", fontSize: 13, margin: 0 }}>Submit and track your travel claims below.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Action Cards */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Link href="/travel-voucher/new" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: "26px 22px", border: "1px solid #e2e8f0", borderTop: "3px solid #1d4ed8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer" }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }}>✈️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0a2540", marginBottom: 6 }}>Travel Expense Voucher</div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 16px" }}>Submit a travel claim with expenses and itinerary. Prints as two pages.</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1d4ed8", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>New Voucher →</div>
              </div>
            </Link>
            <div style={{ background: "#fff", borderRadius: 12, padding: "26px 22px", border: "1px solid #e2e8f0", borderTop: "3px solid #94a3b8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", opacity: 0.6 }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }}>⏱️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0a2540", marginBottom: 6 }}>Overtime Claim</div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 16px" }}>Submit overtime hours for approval.</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#94a3b8", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Coming Soon</div>
            </div>
          </div>
        </div>

        {/* My Vouchers */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(90deg, #1e3a8a, #1d4ed8)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>My Travel Vouchers</div>
            <div style={{ fontSize: 11, color: "#bfdbfe" }}>{vouchers.length} total</div>
          </div>
          {vouchers.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>No vouchers yet. Create your first one above.</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    {["#", "Month", "Trip Type", "Date", "Total (GH¢)", "Action"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#1d4ed8", letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v, idx) => (
                    <tr key={v.id} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={{ padding: "12px 16px", color: "#1d4ed8", fontWeight: 700 }}>#{v.id}</td>
                      <td style={{ padding: "12px 16px", color: "#0a2540", fontWeight: 500 }}>{v.allowanceMonth}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: v.tripType === "Night Trip" ? "#eff6ff" : "#f0fdf4", color: v.tripType === "Night Trip" ? "#1d4ed8" : "#16a34a", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>{v.tripType || "Day Trip"}</span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{v.date || new Date(v.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#1d4ed8" }}>GH¢ {v.totalAmount?.toFixed(2)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <Link href={`/travel-voucher/${v.id}`} style={{ background: "#1d4ed8", color: "#fff", padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View & Print</Link>
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
