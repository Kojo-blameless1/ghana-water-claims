
"use client";

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

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{ background: "#003d99", height: 4 }} />

      {/* ── Header ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #dce6f7", boxShadow: "0 2px 8px rgba(0,61,153,0.07)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", gap: 20 }}>
          <img src="/logo.png" alt="Ghana Water Logo" style={{ height: 64, width: "auto" }} />
          <div style={{ borderLeft: "3px solid #003d99", paddingLeft: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#003d99", letterSpacing: 0.5 }}>
              GHANA WATER LIMITED
            </div>
            <div style={{ fontSize: 13, color: "#5a7abf", marginTop: 2, fontWeight: 500 }}>
              Ashanti South Region &nbsp;·&nbsp; Travel &amp; Claims Management
            </div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#8aa3cc", textAlign: "right", lineHeight: 1.7 }}>
            <div style={{ fontWeight: 700, color: "#003d99", fontSize: 12 }}>GWL INTERNAL SYSTEM</div>
            <div>Authorised Personnel Only</div>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #003d99 0%, #0055cc 60%, #1a6fd4 100%)",
        padding: "40px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -30, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, color: "#a8c4ff", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
            Claims Portal
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: 0.3 }}>
            Submit and Track Your Claims
          </h1>
          <p style={{ color: "#c0d6ff", fontSize: 14, maxWidth: 520, margin: "0 auto" }}>
            Create travel vouchers, summary claims, and itinerary logs — then print them instantly.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>

        {/* ── Action Cards ── */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#5a7abf", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Create New
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>

            {/* Travel Voucher */}
            <Link href="/travel-voucher/new" style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "28px 24px",
                border: "1px solid #dce6f7",
                borderTop: "4px solid #003d99",
                boxShadow: "0 2px 8px rgba(0,61,153,0.06)",
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,61,153,0.14)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,61,153,0.06)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>✈️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#003d99", marginBottom: 8 }}>
                  Travel Expense Voucher
                </div>
                <p style={{ fontSize: 13, color: "#6b7a99", lineHeight: 1.6, margin: 0 }}>
                  Submit a new travel claim, enter expenses, and print the completed voucher.
                </p>
                <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, color: "#003d99", display: "flex", alignItems: "center", gap: 4 }}>
                  New Voucher <span style={{ fontSize: 14 }}>→</span>
                </div>
              </div>
            </Link>

            {/* Summary of Claims */}
            <Link href="/summary-claims/new" style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "28px 24px",
                border: "1px solid #dce6f7",
                borderTop: "4px solid #1a6fd4",
                boxShadow: "0 2px 8px rgba(0,61,153,0.06)",
                cursor: "pointer",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,61,153,0.14)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,61,153,0.06)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#003d99", marginBottom: 8 }}>
                  Summary of Claims
                </div>
                <p style={{ fontSize: 13, color: "#6b7a99", lineHeight: 1.6, margin: 0 }}>
                  Enter monthly staff allowances per district and generate a printable summary sheet.
                </p>
                <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, color: "#1a6fd4", display: "flex", alignItems: "center", gap: 4 }}>
                  New Summary <span style={{ fontSize: 14 }}>→</span>
                </div>
              </div>
            </Link>

            {/* Itinerary */}
            <Link href="/itinerary/new" style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "28px 24px",
                border: "1px solid #dce6f7",
                borderTop: "4px solid #4a90d9",
                boxShadow: "0 2px 8px rgba(0,61,153,0.06)",
                cursor: "pointer",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,61,153,0.14)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,61,153,0.06)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>🗺️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#003d99", marginBottom: 8 }}>
                  Itinerary Log
                </div>
                <p style={{ fontSize: 13, color: "#6b7a99", lineHeight: 1.6, margin: 0 }}>
                  Record departure, arrival, mileage, radius, and conveyance costs per trip leg.
                </p>
                <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, color: "#4a90d9", display: "flex", alignItems: "center", gap: 4 }}>
                  New Itinerary <span style={{ fontSize: 14 }}>→</span>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* ── Recent Vouchers Table ── */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #dce6f7",
          boxShadow: "0 2px 8px rgba(0,61,153,0.06)",
          marginTop: 36,
          overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            background: "linear-gradient(90deg, #003d99, #1a6fd4)",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              Recent Travel Vouchers
            </div>
            <div style={{ fontSize: 11, color: "#a8c4ff", fontWeight: 500 }}>
              Last 5 submissions
            </div>
          </div>

          {recentVouchers.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
              <div style={{ color: "#6b7a99", fontSize: 14 }}>No vouchers yet.</div>
              <div style={{ color: "#a0aec0", fontSize: 13, marginTop: 4 }}>
                Create your first Travel Expense Voucher above.
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f0f4f8", borderBottom: "2px solid #dce6f7" }}>
                    {["ID", "Employee", "Date", "Total (GH¢)", "Action"].map((h) => (
                      <th key={h} style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#5a7abf",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentVouchers.map((voucher: any, idx: number) => (
                    <tr key={voucher.id} style={{
                      borderBottom: "1px solid #eef2fb",
                      background: idx % 2 === 0 ? "#fff" : "#f8faff",
                    }}>
                      <td style={{ padding: "12px 16px", color: "#003d99", fontWeight: 700 }}>
                        #{voucher.id}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#1a2744", fontWeight: 500 }}>
                        {voucher.employee}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#6b7a99" }}>
                        {voucher.date || voucher.createdAt.toLocaleDateString()}
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#003d99" }}>
                        GH¢ {voucher.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Link href={`/travel-voucher/${voucher.id}`} style={{
                          background: "#003d99",
                          color: "#fff",
                          padding: "5px 14px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "inline-block",
                        }}>
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
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#003d99", marginTop: 48 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ color: "#a8c4ff", fontSize: 12 }}>
            © {new Date().getFullYear()} Ghana Water Limited – Ashanti South Region
          </div>
          <div style={{ color: "#5a7abf", fontSize: 12 }}>
            Travel Expense Management System &nbsp;·&nbsp; Internal Use Only
          </div>
        </div>
      </footer>

    </div>
  );
}