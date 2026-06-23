"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ staffNo: "", name: "", username: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffNo: form.staffNo, name: form.name, username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #dce7ff", borderRadius: 8,
    padding: "11px 14px", fontSize: 14, outline: "none",
    background: "#fff", color: "#0a2540", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em",
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", textAlign: "center", maxWidth: 400, width: "100%", border: "1px solid #dce7ff", boxShadow: "0 4px 24px rgba(0,82,204,0.10)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e8f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, color: "#0052cc" }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>Registration Submitted</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
            Your account is pending admin approval. You will be able to log in once approved.
          </p>
          <button
            onClick={() => router.push("/login")}
            style={{ width: "100%", background: "#0052cc", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0052cc", height: 60, display: "flex", alignItems: "center", padding: "0 32px", gap: 16 }}>
        <img src="/logo.png" alt="GWL" style={{ height: 36, width: 36, objectFit: "contain" }} />
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>Ashanti South Region</div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 460, border: "1px solid #dce7ff", boxShadow: "0 4px 24px rgba(0,82,204,0.10)" }}>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0a2540", margin: 0 }}>Create Account</h1>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Register with your GWL staff details</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Staff Number</label>
                <input value={form.staffNo} onChange={(e) => update("staffNo", e.target.value)} style={inputStyle} placeholder="e.g. GWL-0042" required />
              </div>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} style={inputStyle} placeholder="Your full name" required />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Username</label>
              <input value={form.username} onChange={(e) => update("username", e.target.value)} style={inputStyle} placeholder="Choose a username" required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} style={inputStyle} placeholder="Min. 6 characters" required />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} style={inputStyle} placeholder="Repeat password" required />
              </div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: loading ? "#7aa7e0" : "#0052cc",
                color: "#fff", border: "none", borderRadius: 8,
                padding: "12px 0", fontWeight: 700, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(0,82,204,0.3)",
              }}
            >
              {loading ? "Submitting…" : "Register"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 20 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#0052cc", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
