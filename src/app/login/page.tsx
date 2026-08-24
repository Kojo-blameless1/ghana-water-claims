"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [staffNo, setStaffNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ staffNo, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.user?.role === "ADMIN") router.push("/admin");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "11px 14px", fontSize: 14, outline: "none", background: "#fff", color: "#0a2540", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "#1d4ed8", height: 60, display: "flex", alignItems: "center", padding: "0 32px", gap: 16 }}>
        <img src="/logo.png" alt="GWL" style={{ height: 34, objectFit: "contain" }} />
        <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.2)" }} />
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Ashanti South Region</span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 420, border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <img src="/logo.png" alt="GWL" style={{ width: 38, objectFit: "contain" }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>Welcome Back</h1>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 6 }}>Sign in with your staff credentials</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Staff Number</label>
              <input value={staffNo} onChange={e => setStaffNo(e.target.value)} style={inp} placeholder="e.g. 00341" required />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={lbl}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ ...inp, paddingRight: 42 }} placeholder="Your password" required />
                <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#93c5fd" : "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 20 }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#1d4ed8", fontWeight: 600, textDecoration: "none" }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
