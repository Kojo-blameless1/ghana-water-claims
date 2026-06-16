"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type StaffRow = {
  staffNo: string;
  name: string;
  tntProposed: number;
  tntApproved: number;
  nightProposed: number;
  nightApproved: number;
  dayTripProposed: number;
  dayTripApproved: number;
  riskProposed: number;
  riskApproved: number;
  overtimeCatA: number;
  overtimeCatB: number;
  overtimeHrs: number;
  overtimeApproved: number;
};

const emptyRow = (): StaffRow => ({
  staffNo: "",
  name: "",
  tntProposed: 0,
  tntApproved: 0,
  nightProposed: 0,
  nightApproved: 0,
  dayTripProposed: 0,
  dayTripApproved: 0,
  riskProposed: 0,
  riskApproved: 0,
  overtimeCatA: 0,
  overtimeCatB: 0,
  overtimeHrs: 0,
  overtimeApproved: 0,
});

export default function NewSummaryClaim() {
  const router = useRouter();
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [district, setDistrict] = useState("");
  const [month, setMonth] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [staffRows, setStaffRows] = useState<StaffRow[]>([
    emptyRow(),
    emptyRow(),
    emptyRow(),
  ]);

  const addRow = () => setStaffRows((p) => [...p, emptyRow()]);
  const removeRow = (i: number) => {
    if (staffRows.length <= 1) return;
    setStaffRows((p) => p.filter((_, idx) => idx !== i));
  };
  const updateRow = (i: number, field: keyof StaffRow, value: string | number) => {
    setStaffRows((p) => {
      const u = [...p];
      u[i] = { ...u[i], [field]: value };
      return u;
    });
  };

  const handleSave = async () => {
    setError(null);
    try {
      const res = await fetch("/api/summary-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, district, preparedBy, staffEntries: staffRows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSavedId(data.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* ── Success screen ── */
  if (savedId) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#f0f4ff",
      }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "48px 40px",
          textAlign: "center", boxShadow: "0 4px 24px rgba(0,82,204,0.10)",
          maxWidth: 380, width: "100%", border: "1px solid #dce7ff",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "#e8f0ff", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px", fontSize: 28,
          }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>
            Summary Saved
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
            The summary of claims has been recorded successfully.
          </p>
          <button
            onClick={() => router.push(`/summary-claims/${savedId}`)}
            style={{
              width: "100%", background: "#0052cc", color: "#fff",
              border: "none", borderRadius: 8, padding: "11px 0",
              fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10,
            }}
          >
            View &amp; Print Summary
          </button>
          <button
            onClick={() => setSavedId(null)}
            style={{
              width: "100%", background: "transparent", color: "#0052cc",
              border: "1.5px solid #0052cc", borderRadius: 8, padding: "10px 0",
              fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            Enter Another Summary
          </button>
        </div>
      </div>
    );
  }

  /* ── Shared style helpers ── */
  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #dce7ff", borderRadius: 6,
    padding: "8px 10px", fontSize: 13, outline: "none",
    background: "#fff", color: "#0a2540", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };
  const numStyle: React.CSSProperties = {
    ...inputStyle, textAlign: "right", padding: "6px 8px", fontSize: 12,
  };
  const thStyle: React.CSSProperties = {
    background: "#0052cc", color: "#fff", fontWeight: 700,
    fontSize: 11, padding: "8px 6px", textAlign: "center",
    border: "1px solid #0041a8", whiteSpace: "nowrap",
  };
  const subThStyle: React.CSSProperties = {
    background: "#1a6bff", color: "#fff", fontWeight: 500,
    fontSize: 10, padding: "6px 4px", textAlign: "center",
    border: "1px solid #0041a8", whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    border: "1px solid #dce7ff", padding: "3px 4px", verticalAlign: "middle",
  };
  const tdApprovedStyle: React.CSSProperties = {
    ...tdStyle, background: "#f0f4ff",
  };

  const sectionStyle: React.CSSProperties = {
    background: "#fff", borderRadius: 12, padding: "24px 28px",
    marginBottom: 20, border: "1px solid #dce7ff",
    boxShadow: "0 1px 8px rgba(0,82,204,0.06)",
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "#0052cc",
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 16, paddingBottom: 10,
    borderBottom: "2px solid #e8f0ff",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: "#475569", marginBottom: 5, textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Top nav bar ── */}
      <div style={{
        background: "#0052cc", padding: "0 32px",
        display: "flex", alignItems: "center", gap: 16,
        height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}>
        <img src="/logo.png" alt="GWL" style={{ height: 36, width: 36, objectFit: "contain", borderRadius: 4 }} />
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
            Ghana Water Limited
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
            Ashanti South Region
          </div>
        </div>
        <div style={{
          marginLeft: "auto", background: "rgba(255,255,255,0.15)",
          color: "#fff", fontSize: 12, fontWeight: 600,
          padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)",
        }}>
          Summary of Claims
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Page heading */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>
            New Summary of Claims
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
            Fill in the claim details and staff entries below, then save to generate the printable summary.
          </p>
        </div>

        {/* ── Claim Details ── */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>① Claim Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>District</label>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Obuasi"
              />
            </div>
            <div>
              <label style={labelStyle}>Month</label>
              <input
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={inputStyle}
                placeholder="e.g. June 2026"
              />
            </div>
            <div>
              <label style={labelStyle}>Prepared By</label>
              <input
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                style={inputStyle}
                placeholder="Name of preparer"
              />
            </div>
          </div>
        </div>

        {/* ── Staff Entries ── */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 10, borderBottom: "2px solid #e8f0ff" }}>
            <div style={sectionTitleStyle as React.CSSProperties}>② Staff Entries</div>
            <span style={{
              background: "#e8f0ff", color: "#0052cc", fontSize: 11,
              fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            }}>
              {staffRows.length} row{staffRows.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
              <div style={{ width: 14, height: 14, background: "#fff", border: "1px solid #dce7ff", borderRadius: 3 }} />
              Proposed value
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
              <div style={{ width: 14, height: 14, background: "#f0f4ff", border: "1px solid #dce7ff", borderRadius: 3 }} />
              Approved by RCM
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 1100 }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: 60 }} rowSpan={2}>Staff No.</th>
                  <th style={{ ...thStyle, width: 140 }} rowSpan={2}>Name of Staff</th>
                  <th style={thStyle} colSpan={2}>T &amp; T (GH¢)</th>
                  <th style={thStyle} colSpan={2}>Night Allowance (GH¢)</th>
                  <th style={thStyle} colSpan={2}>Day Trip Allowance (GH¢)</th>
                  <th style={thStyle} colSpan={2}>Risk Allowance (GH¢)</th>
                  <th style={thStyle} colSpan={4}>Overtime</th>
                  <th style={{ ...thStyle, width: 36 }} rowSpan={2}></th>
                </tr>
                <tr>
                  {["Proposed", "Approved (RCM)", "Proposed", "Approved (RCM)", "Proposed", "Approved (RCM)", "Proposed", "Approved (RCM)", "Cat A", "Cat C", "Hrs", "Approved (GH¢)"].map((label, i) => (
                    <th key={i} style={subThStyle}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffRows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
                    <td style={tdStyle}>
                      <input value={row.staffNo} onChange={(e) => updateRow(i, "staffNo", e.target.value)} style={{ ...numStyle, textAlign: "left" }} placeholder="No." />
                    </td>
                    <td style={tdStyle}>
                      <input value={row.name} onChange={(e) => updateRow(i, "name", e.target.value)} style={{ ...numStyle, textAlign: "left" }} placeholder="Full name" />
                    </td>
                    {/* T&T */}
                    <td style={tdStyle}><input type="number" value={row.tntProposed || ""} onChange={(e) => updateRow(i, "tntProposed", parseFloat(e.target.value) || 0)} style={numStyle} /></td>
                    <td style={tdApprovedStyle}><input type="number" value={row.tntApproved || ""} onChange={(e) => updateRow(i, "tntApproved", parseFloat(e.target.value) || 0)} style={{ ...numStyle, background: "transparent" }} /></td>
                    {/* Night */}
                    <td style={tdStyle}><input type="number" value={row.nightProposed || ""} onChange={(e) => updateRow(i, "nightProposed", parseFloat(e.target.value) || 0)} style={numStyle} /></td>
                    <td style={tdApprovedStyle}><input type="number" value={row.nightApproved || ""} onChange={(e) => updateRow(i, "nightApproved", parseFloat(e.target.value) || 0)} style={{ ...numStyle, background: "transparent" }} /></td>
                    {/* Day Trip */}
                    <td style={tdStyle}><input type="number" value={row.dayTripProposed || ""} onChange={(e) => updateRow(i, "dayTripProposed", parseFloat(e.target.value) || 0)} style={numStyle} /></td>
                    <td style={tdApprovedStyle}><input type="number" value={row.dayTripApproved || ""} onChange={(e) => updateRow(i, "dayTripApproved", parseFloat(e.target.value) || 0)} style={{ ...numStyle, background: "transparent" }} /></td>
                    {/* Risk */}
                    <td style={tdStyle}><input type="number" value={row.riskProposed || ""} onChange={(e) => updateRow(i, "riskProposed", parseFloat(e.target.value) || 0)} style={numStyle} /></td>
                    <td style={tdApprovedStyle}><input type="number" value={row.riskApproved || ""} onChange={(e) => updateRow(i, "riskApproved", parseFloat(e.target.value) || 0)} style={{ ...numStyle, background: "transparent" }} /></td>
                    {/* Overtime */}
                    <td style={tdStyle}><input type="number" value={row.overtimeCatA || ""} onChange={(e) => updateRow(i, "overtimeCatA", parseFloat(e.target.value) || 0)} style={numStyle} /></td>
                    <td style={tdStyle}><input type="number" value={row.overtimeCatB || ""} onChange={(e) => updateRow(i, "overtimeCatB", parseFloat(e.target.value) || 0)} style={numStyle} /></td>
                    <td style={tdStyle}><input type="number" value={row.overtimeHrs || ""} onChange={(e) => updateRow(i, "overtimeHrs", parseFloat(e.target.value) || 0)} style={numStyle} /></td>
                    <td style={tdApprovedStyle}><input type="number" value={row.overtimeApproved || ""} onChange={(e) => updateRow(i, "overtimeApproved", parseFloat(e.target.value) || 0)} style={{ ...numStyle, background: "transparent" }} /></td>
                    {/* Remove */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {staffRows.length > 1 && (
                        <button
                          onClick={() => removeRow(i)}
                          title="Remove row"
                          style={{
                            background: "#fee2e2", border: "none", borderRadius: 4,
                            color: "#dc2626", fontWeight: 700, fontSize: 14,
                            width: 24, height: 24, cursor: "pointer", lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addRow}
            style={{
              marginTop: 14, border: "1.5px dashed #0052cc", color: "#0052cc",
              background: "transparent", fontSize: 12, fontWeight: 600,
              padding: "7px 18px", borderRadius: 6, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            + Add Staff Row
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 8,
            padding: "10px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Footer actions ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", paddingTop: 8,
        }}>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
            Signature fields appear on the printed summary only.
          </p>
          <button
            type="button"
            onClick={handleSave}
            style={{
              background: "#0052cc", color: "#fff", border: "none",
              borderRadius: 8, padding: "12px 32px", fontWeight: 700,
              fontSize: 14, cursor: "pointer", display: "flex",
              alignItems: "center", gap: 8,
              boxShadow: "0 4px 14px rgba(0,82,204,0.35)",
            }}
          >
            Save &amp; Generate Summary →
          </button>
        </div>
      </div>
    </div>
  );
}