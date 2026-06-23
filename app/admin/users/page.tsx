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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: "#0052cc", fontWeight: 600 }}>Loading users…</div>
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
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Nav bar ── */}
      <div style={{ background: "#0052cc", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <img src="/logo.png" alt="GWL" style={{ height: 36, width: 36, objectFit: "contain", borderRadius: 4 }} />
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>Ashanti South Region — Admin</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Link href="/admin" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            ← Dashboard
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 60px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>User Management</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Approve registrations and manage staff roles.</p>
        </div>

        {message && (
          <div style={{ background: message.type === "success" ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${message.type === "success" ? "#86efac" : "#fca5a5"}`, borderRadius: 8, padding: "10px 16px", color: message.type === "success" ? "#16a34a" : "#dc2626", fontSize: 13, marginBottom: 20 }}>
            {message.type === "success" ? "✓" : "⚠"} {message.text}
          </div>
        )}

        {/* ── Pending Approvals ── */}
        {pending.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #fca5a5", boxShadow: "0 2px 8px rgba(220,38,38,0.06)", overflow: "hidden", marginBottom: 28 }}>
            <div style={{ background: "linear-gradient(90deg, #dc2626, #ef4444)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>⏳ Pending Approvals</div>
              <div style={{ background: "#fff", color: "#dc2626", fontSize: 11, fontWeight: 800, padding: "2px 10px", borderRadius: 20 }}>{pending.length} waiting</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#fef2f2", borderBottom: "2px solid #fecaca" }}>
                    {["Staff No.", "Name", "Username", "Registered", "Action"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#dc2626", letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pending.map((u, idx) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #fef2f2", background: idx % 2 === 0 ? "#fff" : "#fff5f5" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0a2540" }}>{u.staffNo}</td>
                      <td style={{ padding: "12px 16px", color: "#0a2540" }}>{u.name}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{u.username}</td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => doAction(u.id, "approve")}
                          disabled={actionLoading === u.id}
                          style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          {actionLoading === u.id ? "…" : "✓ Approve"}
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
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #dce7ff", boxShadow: "0 2px 8px rgba(0,82,204,0.06)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(90deg, #003d99, #0052cc)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>All Staff Accounts</div>
            <div style={{ fontSize: 11, color: "#a8c4ff" }}>{approved.length} active</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f0f4ff", borderBottom: "2px solid #dce7ff" }}>
                  {["Staff No.", "Name", "Username", "Status", "Role", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#0052cc", letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {approved.map((u, idx) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f0f4ff", background: idx % 2 === 0 ? "#fff" : "#f8faff" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0a2540" }}>{u.staffNo}</td>
                    <td style={{ padding: "12px 16px", color: "#0a2540" }}>{u.name}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{u.username}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={badgeStyle(u.role, u.approved)}>
                        {u.approved ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={badgeStyle(u.role, u.approved)}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                      {u.role === "USER" ? (
                        <button
                          onClick={() => doAction(u.id, "promote")}
                          disabled={actionLoading === u.id}
                          style={{ background: "#e8f0ff", color: "#0052cc", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                        >
                          {actionLoading === u.id ? "…" : "↑ Make Admin"}
                        </button>
                      ) : (
                        <button
                          onClick={() => doAction(u.id, "demote")}
                          disabled={actionLoading === u.id || u.staffNo === (session?.user as any)?.staffNo}
                          style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", opacity: u.staffNo === (session?.user as any)?.staffNo ? 0.4 : 1 }}
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
        </div>

      </div>
    </div>
  );
}