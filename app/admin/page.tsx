"use client";

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
    <div data-threedot style={{ display: "inline-block" }}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{
          background: "#f0f4ff",
          border: "1px solid #dce7ff",
          borderRadius: 6,
          width: 32,
          height: 32,
          cursor: "pointer",
          fontSize: 18,
          color: "#0052cc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
        }}
      >
        ⋮
      </button>

      {open && (
        <div
          data-threedot
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            background: "#fff",
            border: "1px solid #dce7ff",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,82,204,0.15)",
            zIndex: 9999,
            minWidth: 140,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => {
              onPrint();
              setOpen(false);
            }}
            style={{
              width: "100%",
              padding: "9px 14px",
              textAlign: "left",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #f0f4ff",
              fontSize: 13,
              cursor: "pointer",
              color: "#0a2540",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🖨 Print
          </button>

          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            style={{
              width: "100%",
              padding: "9px 14px",
              textAlign: "left",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #f0f4ff",
              fontSize: 13,
              cursor: "pointer",
              color: "#0052cc",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            style={{
              width: "100%",
              padding: "9px 14px",
              textAlign: "left",
              background: "transparent",
              border: "none",
              fontSize: 13,
              cursor: "pointer",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🗑 Delete
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
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "voucher" | "summary"; id: number } | null>(null);

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
    const url = deleteConfirm.type === "voucher"
      ? `/api/travel-voucher/${deleteConfirm.id}`
      : `/api/summary-claim/${deleteConfirm.id}`;

    await fetch(url, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchAll();
  };

  const filteredVouchers = filterMonth
    ? vouchers.filter((v) => v.allowanceMonth?.toLowerCase().includes(filterMonth.toLowerCase()))
    : vouchers;

  if (status === "loading" || loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: "#0052cc", fontWeight: 600 }}>Loading…</div>
      </div>
    );

  const user = session?.user as any;

  const sectionCard: React.CSSProperties = {
    background: "#fff", borderRadius: 12, border: "1px solid #dce7ff",
    boxShadow: "0 2px 8px rgba(0,82,204,0.06)", overflow: "hidden", marginBottom: 28,
  };
  const tableHeader: React.CSSProperties = {
    padding: "10px 16px", textAlign: "left", fontSize: 11,
    fontWeight: 700, color: "#0052cc", letterSpacing: 1, textTransform: "uppercase",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "36px 32px", maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>Confirm Delete</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
              Are you sure you want to delete this {deleteConfirm.type === "voucher" ? "travel voucher" : "summary of claims"}? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: "transparent", color: "#0052cc", border: "1.5px solid #0052cc", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleDelete} style={{ flex: 1, background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nav bar */}
      <div style={{ background: "#0052cc", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <img src="/logo.png" alt="GWL" style={{ height: 36, width: 36, objectFit: "contain", borderRadius: 4 }} />
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>Ashanti South Region — Admin</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/users" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            👥 Manage Users
          </Link>
          <Link href="/summary-claims/new" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            📊 New Summary
          </Link>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Administrator</div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #003d99 0%, #0052cc 55%, #1a6bff 100%)", padding: "36px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, color: "#a8c4ff", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Admin Dashboard</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Claims Overview</h1>
          <p style={{ color: "#c0d6ff", fontSize: 13, margin: 0 }}>View, filter, edit, and print all travel vouchers and summary of claims.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Vouchers", value: vouchers.length, icon: "✈️" },
            { label: "Total Summaries", value: summaries.length, icon: "📊" },
            { label: "This Month", value: vouchers.filter(v => v.allowanceMonth?.includes(new Date().toLocaleString("default", { month: "long" }))).length, icon: "📅" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #dce7ff", boxShadow: "0 2px 8px rgba(0,82,204,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#e8f0ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0052cc" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Travel Vouchers */}
        <div style={sectionCard}>
          <div style={{ background: "linear-gradient(90deg, #003d99, #0052cc)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>All Travel Vouchers</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                placeholder="Filter by month e.g. June 2026"
                style={{ border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, outline: "none", width: 220, color: "#0a2540" }}
              />
              {filterMonth && (
                <button onClick={() => setFilterMonth("")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
              )}
            </div>
          </div>

          {filteredVouchers.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>{filterMonth ? `No vouchers found for "${filterMonth}".` : "No vouchers yet."}</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f0f4ff", borderBottom: "2px solid #dce7ff" }}>
                    {["#", "Employee", "District", "Month", "Date", "Total (GH¢)", ""].map((h) => (
                      <th key={h} style={tableHeader}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVouchers.map((v, idx) => (
                    <tr key={v.id} style={{ borderBottom: "1px solid #f0f4ff", background: idx % 2 === 0 ? "#fff" : "#f8faff" }}>
                      <td style={{ padding: "12px 16px", color: "#0052cc", fontWeight: 700 }}>#{v.id}</td>
                      <td style={{ padding: "12px 16px", color: "#0a2540", fontWeight: 500 }}>{v.employee}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{v.district}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{v.allowanceMonth}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{v.date || new Date(v.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#0052cc" }}>GH¢ {v.totalAmount?.toFixed(2)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <ThreeDotMenu
                          onPrint={() => router.push(`/travel-voucher/${v.id}`)}
                          onEdit={() => router.push(`/travel-voucher/${v.id}/edit`)}
                          onDelete={() => setDeleteConfirm({ type: "voucher", id: v.id })}
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
        <div style={sectionCard}>
          <div style={{ background: "linear-gradient(90deg, #1a6bff, #4a90e2)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>All Summary of Claims</div>
            <Link href="/summary-claims/new" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              + New Summary
            </Link>
          </div>

          {summaries.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>No summaries yet.</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f0f4ff", borderBottom: "2px solid #dce7ff" }}>
                    {["#", "District", "Month", "Prepared By", "Date", ""].map((h) => (
                      <th key={h} style={tableHeader}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((s, idx) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #f0f4ff", background: idx % 2 === 0 ? "#fff" : "#f8faff" }}>
                      <td style={{ padding: "12px 16px", color: "#0052cc", fontWeight: 700 }}>#{s.id}</td>
                      <td style={{ padding: "12px 16px", color: "#0a2540", fontWeight: 500 }}>{s.district}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{s.month}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{s.preparedBy || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <ThreeDotMenu
                          onPrint={() => router.push(`/summary-claims/${s.id}`)}
                          onEdit={() => router.push(`/summary-claims/${s.id}/edit`)}
                          onDelete={() => setDeleteConfirm({ type: "summary", id: s.id })}
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