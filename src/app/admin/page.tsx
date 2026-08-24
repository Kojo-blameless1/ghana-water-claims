"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

type Voucher = { id: number; employee: string; date: string; district: string; totalAmount: number; allowanceMonth: string; tripType: string; createdAt: string; };
type Summary = { id: number; district: string; month: string; preparedBy: string; createdAt: string; };

function ThreeDotMenu({ onPrint, onEdit, onDelete }: { onPrint: () => void; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 4, left: rect.right + window.scrollX - 140 });
    }
    setOpen(p => !p);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest("[data-tdm]")) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div data-tdm style={{ display: "inline-block" }}>
      <button ref={btnRef} onClick={handleOpen} style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>⋮</button>
      {open && (
        <div data-tdm style={{ position: "fixed", top: pos.top, left: pos.left, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", zIndex: 9999, minWidth: 140, overflow: "hidden" }}>
          <button onClick={() => { onPrint(); setOpen(false); }} style={{ width: "100%", padding: "9px 14px", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid #f1f5f9", fontSize: 13, cursor: "pointer", color: "#0a2540", display: "flex", alignItems: "center", gap: 8 }}>🖨 Print</button>
          <button onClick={() => { onEdit(); setOpen(false); }} style={{ width: "100%", padding: "9px 14px", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid #f1f5f9", fontSize: 13, cursor: "pointer", color: "#1d4ed8", display: "flex", alignItems: "center", gap: 8 }}>✏️ Edit</button>
          <button onClick={() => { onDelete(); setOpen(false); }} style={{ width: "100%", padding: "9px 14px", textAlign: "left", background: "transparent", border: "none", fontSize: 13, cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", gap: 8 }}>🗑 Delete</button>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "voucher" | "summary"; id: number } | null>(null);

  useEffect(() => {
    const init = async () => {
      const res = await api("/api/auth/me");
      if (!res.ok) { router.push("/login"); return; }
      const data = await res.json();
      if (data.user?.role !== "ADMIN") { router.push("/dashboard"); return; }
      setUser(data.user);
      fetchAll();
    };
    init();
  }, []);

  const fetchAll = async () => {
    const [vRes, sRes] = await Promise.all([api("/api/vouchers/all"), api("/api/summaries/all")]);
    const [vData, sData] = await Promise.all([vRes.json(), sRes.json()]);
    setVouchers(Array.isArray(vData) ? vData : []);
    setSummaries(Array.isArray(sData) ? sData : []);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const url = deleteConfirm.type === "voucher" ? `/api/vouchers/${deleteConfirm.id}` : `/api/summaries/${deleteConfirm.id}`;
    await api(url, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchAll();
  };

  const handleSignOut = async () => { await api("/api/auth/logout", { method: "POST" }); router.push("/login"); };
  const filtered = filterMonth ? vouchers.filter(v => v.allowanceMonth?.toLowerCase().includes(filterMonth.toLowerCase())) : vouchers;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ color: "#1d4ed8", fontWeight: 600 }}>Loading…</div>
    </div>
  );

  const th: React.CSSProperties = { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#1d4ed8", letterSpacing: 1, textTransform: "uppercase" };
  const card: React.CSSProperties = { background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", marginBottom: 26 };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px", maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>Confirm Delete</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Are you sure? This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: "transparent", color: "#1d4ed8", border: "1.5px solid #1d4ed8", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div style={{ background: "#1d4ed8", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <img src="/logo.png" alt="GWL" style={{ height: 34, objectFit: "contain" }} />
        <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.2)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Ashanti South Region — Admin</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/admin/users" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>👥 Manage Users</Link>
          <Link href="/summary-claims/new" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>📊 New Summary</Link>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Administrator</div>
          </div>
          <button onClick={handleSignOut} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sign Out</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)", padding: "32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, color: "#bfdbfe", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Admin Dashboard</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Claims Overview</h1>
          <p style={{ color: "#bfdbfe", fontSize: 13, margin: 0 }}>View, filter, edit and print all claims.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 60px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
          {[{ label: "Total Vouchers", value: vouchers.length, icon: "✈️" }, { label: "Total Summaries", value: summaries.length, icon: "📊" }, { label: "This Month", value: vouchers.filter(v => v.allowanceMonth?.includes(new Date().toLocaleString("default", { month: "long" }))).length, icon: "📅" }].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#1d4ed8" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Vouchers */}
        <div style={card}>
          <div style={{ background: "linear-gradient(90deg,#1e3a8a,#1d4ed8)", padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>All Travel Vouchers</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input value={filterMonth} onChange={e => setFilterMonth(e.target.value)} placeholder="Filter by month…" style={{ border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, outline: "none", width: 200, color: "#0a2540" }} />
              {filterMonth && <button onClick={() => setFilterMonth("")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>{filterMonth ? `No vouchers for "${filterMonth}".` : "No vouchers yet."}</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["#", "Employee", "District", "Month", "Trip Type", "Total (GH¢)", ""].map(h => <th key={h} style={th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filtered.map((v, idx) => (
                    <tr key={v.id} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={{ padding: "12px 16px", color: "#1d4ed8", fontWeight: 700 }}>#{v.id}</td>
                      <td style={{ padding: "12px 16px", color: "#0a2540", fontWeight: 500 }}>{v.employee}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{v.district}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{v.allowanceMonth}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: v.tripType === "Night Trip" ? "#eff6ff" : "#f0fdf4", color: v.tripType === "Night Trip" ? "#1d4ed8" : "#16a34a", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>{v.tripType || "Day Trip"}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#1d4ed8" }}>GH¢ {v.totalAmount?.toFixed(2)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <ThreeDotMenu onPrint={() => router.push(`/travel-voucher/${v.id}`)} onEdit={() => router.push(`/travel-voucher/${v.id}/edit`)} onDelete={() => setDeleteConfirm({ type: "voucher", id: v.id })} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summaries */}
        <div style={card}>
          <div style={{ background: "linear-gradient(90deg,#1d4ed8,#3b82f6)", padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>All Summary of Claims</div>
            <Link href="/summary-claims/new" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>+ New Summary</Link>
          </div>
          {summaries.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>No summaries yet.</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["#", "District", "Month", "Prepared By", "Date", ""].map(h => <th key={h} style={th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {summaries.map((s, idx) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={{ padding: "12px 16px", color: "#1d4ed8", fontWeight: 700 }}>#{s.id}</td>
                      <td style={{ padding: "12px 16px", color: "#0a2540", fontWeight: 500 }}>{s.district}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{s.month}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{s.preparedBy || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <ThreeDotMenu onPrint={() => router.push(`/summary-claims/${s.id}`)} onEdit={() => router.push(`/summary-claims/${s.id}/edit`)} onDelete={() => setDeleteConfirm({ type: "summary", id: s.id })} />
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
