"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  overtimeCatC: number;
  overtimeHrs: number;
  overtimeApproved: number;
};

type SummaryClaim = {
  id: number;
  month: string;
  district: string;
  preparedBy: string | null;
  staffEntries: string;
};

const f = (n: number) => (n && n !== 0 ? n.toFixed(2) : "");
const MIN_ROWS = 12;

export default function ViewSummaryClaim() {
  const { id } = useParams();
  const [claim, setClaim] = useState<SummaryClaim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/summary-claim/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setClaim(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#555" }}>
        Loading summary…
      </div>
    );
  if (!claim)
    return (
      <div style={{ padding: 32, textAlign: "center", color: "red" }}>
        Summary not found.
      </div>
    );

  const entries: StaffRow[] = JSON.parse(claim.staffEntries);
  const rows: (StaffRow | null)[] = [
    ...entries,
    ...Array(Math.max(0, MIN_ROWS - entries.length)).fill(null),
  ];

  // ── Shared styles ──────────────────────────────────────────────────
  const page: React.CSSProperties = {
    maxWidth: 1050,
    margin: "24px auto 48px",
    padding: "32px 40px",
    background: "#fff",
    border: "1px solid #ccc",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: 9,
    color: "#000",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
  };
  const th = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #000",
    padding: "3px 4px",
    textAlign: "center",
    fontWeight: "bold",
    background: "#e8e8e8",
    fontSize: 8,
    verticalAlign: "middle",
    ...extra,
  });
  const td = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #000",
    padding: "2px 4px",
    fontSize: 8.5,
    height: 22,
    ...extra,
  });

  return (
    <>
      {/* ── Screen toolbar ── */}
      <div
        id="gwl-toolbar"
        style={{
          background: "#006837",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
          Summary of Claims #{claim.id} — {claim.district} — {claim.month}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => window.history.back()}
            style={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "transparent",
              padding: "4px 12px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            style={{
              background: "#fff",
              color: "#006837",
              fontWeight: 700,
              padding: "4px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              border: "none",
            }}
          >
            🖨 Print Summary
          </button>
        </div>
      </div>

      {/* ── Printable document ── */}
      <div id="gwl-print-page" style={page}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontWeight: "bold", fontSize: 13, letterSpacing: 0.4 }}>
            GWL – ASHANTI SOUTH
          </div>
          <div style={{ fontWeight: "bold", fontSize: 11 }}>
            SUMMARY OF CLAIMS
          </div>
        </div>

        {/* District / Month */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            fontSize: 9.5,
          }}
        >
          <div>
            <strong>DISTRICT:</strong>{" "}
            <span
              style={{
                borderBottom: "1px solid #000",
                minWidth: 180,
                display: "inline-block",
                paddingLeft: 4,
              }}
            >
              {claim.district}
            </span>
          </div>
          <div>
            <strong>MONTH:</strong>{" "}
            <span
              style={{
                borderBottom: "1px solid #000",
                minWidth: 130,
                display: "inline-block",
                paddingLeft: 4,
              }}
            >
              {claim.month}
            </span>
          </div>
        </div>

        {/* Main table */}
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}
        >
          <thead>
            <tr>
              <th rowSpan={2} style={th({ width: "5%" })}>
                STAFF NO.
              </th>
              <th rowSpan={2} style={th({ width: "13%" })}>
                NAME OF STAFF
              </th>
              <th colSpan={2} style={th()}>
                T &amp; T
              </th>
              <th colSpan={2} style={th()}>
                NIGHT ALLOWANCE
              </th>
              <th colSpan={2} style={th()}>
                DAY TRIP ALLOWANCE
              </th>
              <th colSpan={2} style={th()}>
                RISK ALLOWANCE
              </th>
              <th colSpan={3} style={th()}>
                OVERTIME HOURS
              </th>
              <th rowSpan={2} style={th({ width: "7%" })}>
                OVERTIME APPROVED (GH¢)
              </th>
            </tr>
            <tr>
              {[
                "AMOUNT PROPOSED (GH¢)",
                "AMOUNT APPROVED BY RCM (GH¢)",
                "AMOUNT PROPOSED (GH¢)",
                "AMOUNT APPROVED BY RCM (GH¢)",
                "AMOUNT PROPOSED (GH¢)",
                "AMOUNT APPROVED BY RCM / UNIT HEAD (GH¢)",
                "AMOUNT PROPOSED (GH¢)",
                "AMOUNT APPROVED BY RCM (GH¢)",
                "CAT. A",
                "CAT. C",
                "OVERTIME HRS",
              ].map((label, i) => (
                <th key={i} style={th({ fontSize: 7, background: "#f0f0f0" })}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td style={td({ textAlign: "center" })}>
                  {row?.staffNo || ""}
                </td>
                <td style={td()}>{row?.name || ""}</td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.tntProposed) : ""}
                </td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.tntApproved) : ""}
                </td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.nightProposed) : ""}
                </td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.nightApproved) : ""}
                </td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.dayTripProposed) : ""}
                </td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.dayTripApproved) : ""}
                </td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.riskProposed) : ""}
                </td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.riskApproved) : ""}
                </td>
                <td style={td({ textAlign: "center" })}>
                  {row ? row.overtimeCatA || "" : ""}
                </td>
                <td style={td({ textAlign: "center" })}>
                  {row ? row.overtimeCatC || "" : ""}
                </td>
                <td style={td({ textAlign: "center" })}>
                  {row ? row.overtimeHrs || "" : ""}
                </td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                  {row ? f(row.overtimeApproved) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Approval signatures */}
        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            fontSize: 9,
          }}
        >
          <div>
            <div style={{ fontWeight: "bold", marginBottom: 28 }}>
              RECOMMENDED FOR APPROVAL:
            </div>
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  borderTop: "1px solid #000",
                  paddingTop: 2,
                  marginTop: 32,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 9,
                }}
              >
                DDO / DCO
              </div>
            </div>
            <div>
              <div
                style={{
                  borderTop: "1px solid #000",
                  paddingTop: 2,
                  marginTop: 32,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 9,
                }}
              >
                DISTRICT/UNIT HEAD
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: "bold", marginBottom: 28 }}>
              APPROVED BY:
            </div>
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  borderTop: "1px solid #000",
                  paddingTop: 2,
                  marginTop: 32,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 9,
                }}
              >
                SECTIONAL HEAD
              </div>
            </div>
            <div>
              <div
                style={{
                  borderTop: "1px solid #000",
                  paddingTop: 2,
                  marginTop: 32,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 9,
                }}
              >
                REGIONAL CHIEF MANAGER
              </div>
            </div>
          </div>
        </div>

        {claim.preparedBy && (
          <div
            style={{
              fontSize: 8,
              marginTop: 16,
              borderTop: "1px dotted #aaa",
              paddingTop: 6,
              color: "#555",
            }}
          >
            Prepared by: {claim.preparedBy}
          </div>
        )}
      </div>

      {/* ── Print CSS — the key trick: only #gwl-print-page is visible ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * { visibility: hidden; }
          #gwl-print-page, #gwl-print-page * { visibility: visible; }
          #gwl-print-page {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm 14mm !important;
            border: none !important;
            box-shadow: none !important;
          }
          #gwl-toolbar { display: none !important; }
        }
      `,
        }}
      />
    </>
  );
}
