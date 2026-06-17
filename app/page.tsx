import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Home() {
  const recentVouchers = await prisma.travelVoucher.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      employee: true,
      date: true,
      totalAmount: true,
      createdAt: true,
    },
  });

  const recentSummaries = await prisma.summaryClaim.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      district: true,
      month: true,
      createdAt: true,
    },
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        background: "#0052cc",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", gap: 20 }}>
          <img src="/logo.png" alt="Ghana Water Logo" style={{ height: 44, width: "auto" }} />
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.25)" }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>
              GHANA WATER LIMITED
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>
              Ashanti South Region &nbsp;·&nbsp; Travel &amp; Claims Management
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>GWL INTERNAL SYSTEM</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>Authorised Personnel Only</div>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #003d99 0%, #0052cc 55%, #1a6bff 100%)",
        padding: "48px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -70, left: -40, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", top: 20, left: "20%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, color: "#a8c4ff", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
            Claims Portal
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: 0.3 }}>
            Submit and Track Your Claims
          </h1>
          <p style={{ color: "#c0d6ff", fontSize: 14, maxWidth: 500, margin: "0 auto" }}>
            Create travel vouchers and summary claims — then print them instantly for approval.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* ── Action Cards ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0052cc", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Create New
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>

            {/* Travel Voucher Card */}
            <Link href="/travel-voucher/new" style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff",
                borderRadius: 14,
                padding: "32px 28px",
                border: "1px solid #dce7ff",
                borderTop: "4px solid #0052cc",
                boxShadow: "0 2px 8px rgba(0,82,204,0.07)",
                cursor: "pointer",
                height: "100%",
                boxSizing: "border-box",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: "#e8f0ff", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 16,
                }}>✈️</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>
                  Travel Expense Voucher
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: "0 0 20px" }}>
                  Submit a new travel claim with expenses and itinerary. Prints as two pages — voucher and itinerary.
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#0052cc", color: "#fff",
                  padding: "8px 18px", borderRadius: 8,
                  fontSize: 12, fontWeight: 700,
                }}>
                  New Voucher <span>→</span>
                </div>
              </div>
            </Link>

            {/* Summary of Claims Card */}
            <Link href="/summary-claims/new" style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff",
                borderRadius: 14,
                padding: "32px 28px",
                border: "1px solid #dce7ff",
                borderTop: "4px solid #1a6bff",
                boxShadow: "0 2px 8px rgba(0,82,204,0.07)",
                cursor: "pointer",
                height: "100%",
                boxSizing: "border-box",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: "#e8f0ff", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 16,
                }}>📊</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>
                  Summary of Claims
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: "0 0 20px" }}>
                  Enter monthly staff allowances per district and generate a printable summary sheet for RCM approval.
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#1a6bff", color: "#fff",
                  padding: "8px 18px", borderRadius: 8,
                  fontSize: 12, fontWeight: 700,
                }}>
                  New Summary <span>→</span>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* ── Recent Activity — two columns ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Recent Travel Vouchers */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #dce7ff",
            boxShadow: "0 2px 8px rgba(0,82,204,0.06)",
            overflow: "hidden",
          }}>
            <div style={{
              background: "linear-gradient(90deg, #003d99, #0052cc)",
              padding: "14px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Recent Vouchers</div>
              <div style={{ fontSize: 11, color: "#a8c4ff" }}>Last 5</div>
            </div>

            {recentVouchers.length === 0 ? (
              <div style={{ padding: "36px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>No vouchers yet.</div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                  Create your first voucher above.
                </div>
              </div>
            ) : (
              <div>
                {recentVouchers.map((v: any, idx: number) => (
                  <div key={v.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 20px",
                    borderBottom: idx < recentVouchers.length - 1 ? "1px solid #f0f4ff" : "none",
                    background: idx % 2 === 0 ? "#fff" : "#f8faff",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0a2540" }}>
                        {v.employee}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                        #{v.id} &nbsp;·&nbsp; {v.date || new Date(v.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#0052cc", fontSize: 13 }}>
                        GH¢ {v.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                      <Link href={`/travel-voucher/${v.id}`} style={{
                        background: "#0052cc", color: "#fff",
                        padding: "4px 12px", borderRadius: 6,
                        fontSize: 11, fontWeight: 600, textDecoration: "none",
                      }}>
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Summary Claims */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #dce7ff",
            boxShadow: "0 2px 8px rgba(0,82,204,0.06)",
            overflow: "hidden",
          }}>
            <div style={{
              background: "linear-gradient(90deg, #1a6bff, #4a90e2)",
              padding: "14px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Recent Summaries</div>
              <div style={{ fontSize: 11, color: "#c0d6ff" }}>Last 5</div>
            </div>

            {recentSummaries.length === 0 ? (
              <div style={{ padding: "36px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>No summaries yet.</div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                  Create your first summary above.
                </div>
              </div>
            ) : (
              <div>
                {recentSummaries.map((s: any, idx: number) => (
                  <div key={s.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 20px",
                    borderBottom: idx < recentSummaries.length - 1 ? "1px solid #f0f4ff" : "none",
                    background: idx % 2 === 0 ? "#fff" : "#f8faff",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0a2540" }}>
                        {s.district}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                        #{s.id} &nbsp;·&nbsp; {s.month}
                      </div>
                    </div>
                    <Link href={`/summary-claims/${s.id}`} style={{
                      background: "#1a6bff", color: "#fff",
                      padding: "4px 12px", borderRadius: 6,
                      fontSize: 11, fontWeight: 600, textDecoration: "none",
                    }}>
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#0052cc", marginTop: 48 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
            © {new Date().getFullYear()} Ghana Water Limited – Ashanti South Region
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            Travel Expense Management System &nbsp;·&nbsp; Internal Use Only
          </div>
        </div>
      </footer>

    </div>
  );
}