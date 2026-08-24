"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ staffNo: "", name: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ staffNo: form.staffNo, name: form.name, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "11px 14px", fontSize: 14, outline: "none", background: "#fff", color: "#0a2540", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };

  if (success) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", textAlign: "center", maxWidth: 400, width: "100%", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, color: "#1d4ed8" }}>✓</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>Registration Submitted</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Your account is pending admin approval.</p>
        <button onClick={() => router.push("/login")} style={{ width: "100%", background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Go to Login</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "#1d4ed8", height: 60, display: "flex", alignItems: "center", padding: "0 32px", gap: 16 }}>
        <img src="/logo.png" alt="GWL" style={{ height: 34, objectFit: "contain" }} />
        <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.2)" }} />
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Ashanti South Region</span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "44px 40px", width: "100%", maxWidth: 440, border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>Create Account</h1>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 6 }}>Register with your GWL staff details</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={lbl}>Staff Number</label>
                <input value={form.staffNo} onChange={e => update("staffNo", e.target.value)} style={inp} placeholder="e.g. 00341" required />
              </div>
              <div>
                <label style={lbl}>Full Name</label>
                <input value={form.name} onChange={e => update("name", e.target.value)} style={inp} placeholder="Your full name" required />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} style={{ ...inp, paddingRight: 42 }} placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={lbl}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input type={showConfirm ? "text" : "password"} value={form.confirm} onChange={e => update("confirm", e.target.value)} style={{ ...inp, paddingRight: 42 }} placeholder="Repeat password" required />
                <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16 }}>
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#93c5fd" : "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Submitting…" : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 20 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#1d4ed8", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
