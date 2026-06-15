"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ItineraryRow = {
  depPlace: string;
  depDate: string;
  depHour: string;
  arrPlace: string;
  arrDate: string;
  arrHour: string;
  mileageStandard: number;
  mileageSubstandard: number;
  radius: number;
  conveyanceAmount: number;
};

type Itinerary = {
  id: number;
  entries: ItineraryRow[];
};

const fmt = (n: number | null | undefined) =>
  n != null && n !== 0 ? n.toFixed(2) : "";

export default function ViewItinerary() {
  const params = useParams();
  const id = params?.id;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/itinerary/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.error) {
          setError(d.error);
        } else {
          setItinerary(d);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif", color: "#555" }}>
        Loading itinerary…
      </div>
    );
  if (error)
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif", color: "red" }}>
        Error: {error}
      </div>
    );
  if (!itinerary)
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif", color: "red" }}>
        Itinerary not found.
      </div>
    );

  const originalEntries = itinerary.entries;
  const totalConveyance = originalEntries.reduce((sum, row) => sum + (row.conveyanceAmount || 0), 0);

  // Pad to at least 15 rows
  const MIN_ROWS = 15;
  const paddedEntries = [...originalEntries];
  if (paddedEntries.length < MIN_ROWS) {
    const emptyRow: ItineraryRow = {
      depPlace: "", depDate: "", depHour: "",
      arrPlace: "", arrDate: "", arrHour: "",
      mileageStandard: 0, mileageSubstandard: 0,
      radius: 0, conveyanceAmount: 0,
    };
    for (let i = paddedEntries.length; i < MIN_ROWS; i++) {
      paddedEntries.push(emptyRow);
    }
  }

  const pageStyle: React.CSSProperties = {
    maxWidth: 1024,
    margin: "24px auto 48px",
    padding: "30px 40px",
    background: "#fff",
    border: "1px solid #ccc",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: 10,
    color: "#000",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "12px 0 8px",
    fontSize: 9.5,
  };
  const th = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #000",
    padding: "5px 6px",
    textAlign: "center",
    fontWeight: "bold",
    background: "#efefef",
    fontSize: 9,
    ...extra,
  });
  const td = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #000",
    padding: "4px 6px",
    fontSize: 9.5,
    ...extra,
  });
  const tdRight = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    ...td(),
    textAlign: "right",
    fontFamily: "monospace",
    ...extra,
  });

  return (
    <>
      {/* Toolbar (hidden when printing) */}
      <div
        id="itinerary-toolbar"
        style={{
          background: "#006837",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
          GWL Itinerary #{itinerary.id}
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
            🖨 Print Itinerary
          </button>
        </div>
      </div>

      {/* Printable content */}
      <div id="gwl-print-itinerary" style={pageStyle}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <img
            src="/logo.png"
            alt="GWL Logo"
            style={{ width: 64, height: 64, objectFit: "contain" }}
          />
          <div style={{ textAlign: "center", flex: 1 }}>
            <div
              style={{ fontWeight: "bold", fontSize: 16, letterSpacing: 0.5 }}
            >
              GHANA WATER LIMITED
            </div>
            <div style={{ fontSize: 13 }}>ASHANTI SOUTH REGION</div>
            <div
              style={{
                fontSize: 13,
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              ITINERARY
            </div>
          </div>
          <div style={{ width: 64 }}></div> {/* spacer for symmetry */}
        </div>
        <hr style={{ borderTop: "1.5px solid #000", margin: "6px 0 16px" }} />

        {/* Table */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th colSpan={3} style={th()}>Departure From</th>
              <th colSpan={3} style={th()}>Arrival at</th>
              <th colSpan={2} style={th()}>Mileage</th>
              <th style={th()}>Radius</th>
              <th style={th()}>Means of Conveyance (GH¢)</th>
            </tr>
            <tr style={{ background: "#f9f9f9" }}>
              <th style={th()}>Place</th>
              <th style={th()}>Date</th>
              <th style={th()}>Hour</th>
              <th style={th()}>Place</th>
              <th style={th()}>Date</th>
              <th style={th()}>Hour</th>
              <th style={th()}>Standard</th>
              <th style={th()}>Sub‑standard</th>
              <th style={th()}></th>
              <th style={th()}></th>
            </tr>
          </thead>
          <tbody>
            {paddedEntries.map((row, idx) => (
              <tr key={idx}>
                <td style={{ ...td(), minWidth: 80, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.depPlace || "\u00A0"}
                </td>
                <td style={{ ...td(), minWidth: 80, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.depDate || "\u00A0"}
                </td>
                <td style={{ ...td(), minWidth: 60, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.depHour || "\u00A0"}
                </td>
                <td style={{ ...td(), minWidth: 80, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.arrPlace || "\u00A0"}
                </td>
                <td style={{ ...td(), minWidth: 80, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.arrDate || "\u00A0"}
                </td>
                <td style={{ ...td(), minWidth: 60, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.arrHour || "\u00A0"}
                </td>
                <td style={{ ...tdRight(), minWidth: 70, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.mileageStandard && row.mileageStandard !== 0 ? row.mileageStandard.toFixed(2) : "\u00A0"}
                </td>
                <td style={{ ...tdRight(), minWidth: 70, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.mileageSubstandard && row.mileageSubstandard !== 0 ? row.mileageSubstandard.toFixed(2) : "\u00A0"}
                </td>
                <td style={{ ...tdRight(), minWidth: 60, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.radius && row.radius !== 0 ? row.radius.toFixed(2) : "\u00A0"}
                </td>
                <td style={{ ...tdRight(), minWidth: 80, minHeight: 24, verticalAlign: "middle", padding: "4px 6px" }}>
                  {row.conveyanceAmount && row.conveyanceAmount !== 0 ? row.conveyanceAmount.toFixed(2) : "\u00A0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 12,
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          Total Mileage (GH¢): {totalConveyance.toFixed(2)}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: 9,
            fontFamily: "monospace",
          }}
        >
          G.W.L. ACCTS. FORMS – ITINERARY
        </div>
      </div>

      {/* Print CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * { visibility: hidden; }
              #gwl-print-itinerary, #gwl-print-itinerary * { visibility: visible; }
              #gwl-print-itinerary {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 14mm 20mm !important;
                border: none !important;
                box-shadow: none !important;
              }
              #itinerary-toolbar { display: none !important; }
            }
          `,
        }}
      />
    </>
  );
}