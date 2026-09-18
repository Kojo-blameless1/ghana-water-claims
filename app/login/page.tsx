"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [staffNo, setStaffNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      staffNo,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "Account pending approval") {
        setError("Your account is pending admin approval.");
      } else {
        setError("Invalid staff number or password.");
      }
      return;
    }

    // Redirect based on role — fetch session to check
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
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

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", flexDirection: "column", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0052cc", height: 60, display: "flex", alignItems: "center", padding: "0 32px", gap: 16 }}>
        <img src="/logo.png" alt="GWL" style={{ height: 36, width: 36, objectFit: "contain" }} />
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>Ashanti South Region</div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 420, border: "1px solid #dce7ff", boxShadow: "0 4px 24px rgba(0,82,204,0.10)" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e8f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <img src="/logo.png" alt="GWL" style={{ width: 40, height: 40, objectFit: "contain" }} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0a2540", margin: 0 }}>Welcome Back</h1>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Sign in with your staff credentials</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Staff Number</label>
              <input
                value={staffNo}
                onChange={(e) => setStaffNo(e.target.value)}
                style={inputStyle}
                placeholder="e.g. GWL-0042"
                required
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="Your password"
                required
              />
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 20 }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#0052cc", fontWeight: 600, textDecoration: "none" }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}