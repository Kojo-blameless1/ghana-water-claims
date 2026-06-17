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

type Voucher = {
  id: number;
  employee: string;
  post: string;
  district: string;
  activity: string;
  purpose: string;
  allowanceMonth: string;
  hotelNights: number;
  hotelPerNight: number;
  hotelActual: number;
  byAir: number;
  byRail: number;
  privateVehicleMiles: number;
  privateVehicleRate: number;
  tolls: number;
  miscellaneous: number;
  totalAmount: number;
  accountCode: string;
  date: string;
  itineraryEntries: string;
};

const f = (n: number) => (n && n !== 0 ? `GH¢ ${n.toFixed(2)}` : "—");
const MIN_ITIN_ROWS = 15;

export default function ViewTravelVoucher() {
  const { id } = useParams();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/travel-voucher/${id}`)
      .then((r) => r.json())
      .then((d) => { setVoucher(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: "#0052cc", fontSize: 14, fontWeight: 600 }}>Loading voucher…</div>
      </div>
    );
  if (!voucher)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: "#dc2626", fontSize: 14 }}>Voucher not found.</div>
      </div>
    );

  const itinEntries: ItineraryRow[] = JSON.parse(voucher.itineraryEntries || "[]");
  const itinRows: (ItineraryRow | null)[] = [
    ...itinEntries,
    ...Array(Math.max(0, MIN_ITIN_ROWS - itinEntries.length)).fill(null),
  ];
  const totalMileageStd = itinEntries.reduce((s, r) => s + (r.mileageStandard || 0), 0);
  const totalMileageSub = itinEntries.reduce((s, r) => s + (r.mileageSubstandard || 0), 0);
  const totalConveyance = itinEntries.reduce((s, r) => s + (r.conveyanceAmount || 0), 0);

  /* ── Print table cell styles ── */
  const th = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #000", padding: "3px 4px", textAlign: "center",
    fontWeight: "bold", background: "#e8e8e8", fontSize: 8,
    verticalAlign: "middle", ...extra,
  });
  const td = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #000", padding: "2px 4px", fontSize: 8.5, height: 22, ...extra,
  });

  const docStyle: React.CSSProperties = {
    maxWidth: 900,
    margin: "24px auto",
    padding: "32px 40px",
    background: "#fff",
    border: "1px solid #ccc",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: 9,
    color: "#000",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
  };

  const docHeader = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <img src="/logo.png" alt="GWL Logo" style={{ width: 56, height: 56, objectFit: "contain" }} />
      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{ fontWeight: "bold", fontSize: 13, letterSpacing: 0.5 }}>GHANA WATER LIMITED</div>
        <div style={{ fontSize: 10 }}>ASHANTI SOUTH REGION</div>
      </div>
      <div style={{ fontSize: 9, textAlign: "right", lineHeight: 1.9 }}>
        <div>Original</div>
        <div>Duplicate</div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Screen toolbar ── */}
      <div id="gwl-toolbar" style={{
        background: "#0052cc", padding: "0 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="GWL" style={{ height: 34, width: 34, objectFit: "contain", borderRadius: 4 }} />
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
            Voucher #{voucher.id} — {voucher.employee} — {voucher.allowanceMonth}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => window.history.back()}
            style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.4)", background: "transparent", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
          >
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            style={{ background: "#fff", color: "#0052cc", fontWeight: 700, padding: "6px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, border: "none" }}
          >
            🖨 Print Both Pages
          </button>
        </div>
      </div>

      {/* ══════════════ PAGE 1: TRAVEL VOUCHER ══════════════ */}
      <div id="gwl-page-1" style={docStyle}>
        {docHeader}
        <hr style={{ borderTop: "1.5px solid #000", margin: "6px 0 10px" }} />
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 12, textDecoration: "underline", marginBottom: 12 }}>
          TRAVEL EXPENSE VOUCHER
        </div>

        {/* Employee info grid */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10, fontSize: 9 }}>
          <tbody>
            <tr>
              <td style={td({ width: "15%", fontWeight: "bold" })}>EMPLOYEE:</td>
              <td style={td({ width: "35%" })}>{voucher.employee}</td>
              <td style={td({ width: "15%", fontWeight: "bold" })}>POST:</td>
              <td style={td({ width: "35%" })}>{voucher.post}</td>
            </tr>
            <tr>
              <td style={td({ fontWeight: "bold" })}>DISTRICT:</td>
              <td style={td()}>{voucher.district}</td>
              <td style={td({ fontWeight: "bold" })}>DATE:</td>
              <td style={td()}>{voucher.date}</td>
            </tr>
            <tr>
              <td style={td({ fontWeight: "bold" })}>ACTIVITY:</td>
              <td style={td()}>{voucher.activity}</td>
              <td style={td({ fontWeight: "bold" })}>MONTH:</td>
              <td style={td()}>{voucher.allowanceMonth}</td>
            </tr>
            <tr>
              <td style={td({ fontWeight: "bold" })}>PURPOSE:</td>
              <td style={td({ colSpan: 3 } as any)} colSpan={3}>{voucher.purpose}</td>
            </tr>
          </tbody>
        </table>

        {/* Expenses table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9, marginBottom: 10 }}>
          <thead>
            <tr>
              <th style={th({ width: "50%" })}>DESCRIPTION</th>
              <th style={th()}>AMOUNT (GH¢)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td()}>Hotel / Guest House Lodging ({voucher.hotelNights} nights × GH¢ {voucher.hotelPerNight?.toFixed(2)})</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{voucher.hotelActual ? voucher.hotelActual.toFixed(2) : "—"}</td>
            </tr>
            <tr>
              <td style={td()}>By Air</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{voucher.byAir ? voucher.byAir.toFixed(2) : "—"}</td>
            </tr>
            <tr>
              <td style={td()}>By Rail</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{voucher.byRail ? voucher.byRail.toFixed(2) : "—"}</td>
            </tr>
            <tr>
              <td style={td()}>Private Vehicle ({voucher.privateVehicleMiles} miles × GH¢ {voucher.privateVehicleRate?.toFixed(2)})</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace" })}>
                {voucher.privateVehicleMiles && voucher.privateVehicleRate
                  ? (voucher.privateVehicleMiles * voucher.privateVehicleRate).toFixed(2) : "—"}
              </td>
            </tr>
            <tr>
              <td style={td()}>Tolls / Other</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{voucher.tolls ? voucher.tolls.toFixed(2) : "—"}</td>
            </tr>
            <tr>
              <td style={td()}>Miscellaneous</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{voucher.miscellaneous ? voucher.miscellaneous.toFixed(2) : "—"}</td>
            </tr>
            <tr>
              <td style={td({ fontWeight: "bold", background: "#e8e8e8" })}>TOTAL</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace", fontWeight: "bold", background: "#e8e8e8" })}>{voucher.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {voucher.accountCode && (
          <div style={{ fontSize: 9, marginBottom: 10 }}>
            <strong>ACCOUNT CODE:</strong> {voucher.accountCode}
          </div>
        )}

        {/* Signatures */}
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, fontSize: 9 }}>
          {["CLAIMANT", "RECOMMENDED BY", "APPROVED BY"].map((label) => (
            <div key={label}>
              <div style={{ borderTop: "1px solid #000", paddingTop: 2, marginTop: 32, textAlign: "center", fontWeight: "bold" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ PAGE 2: ITINERARY ══════════════ */}
      <div id="gwl-page-2" style={{ ...docStyle, marginTop: 0, borderTop: "none" }}>
        {docHeader}
        <hr style={{ borderTop: "1.5px solid #000", margin: "6px 0 10px" }} />
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 12, textDecoration: "underline", marginBottom: 12 }}>
          ITINERARY
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}>
          <thead>
            <tr>
              <th style={th({ width: 20 })}>#</th>
              <th style={th()} colSpan={3}>DEPARTURE FROM</th>
              <th style={th()} colSpan={3}>ARRIVAL AT</th>
              <th style={th()} colSpan={2}>MILEAGE</th>
              <th style={th()}>RADIUS</th>
              <th style={th()}>MEANS OF CONVEYANCE (GH¢)</th>
            </tr>
            <tr>
              <th style={th({ fontSize: 7 })}></th>
              <th style={th({ fontSize: 7 })}>PLACE</th>
              <th style={th({ fontSize: 7 })}>DATE</th>
              <th style={th({ fontSize: 7 })}>HOUR</th>
              <th style={th({ fontSize: 7 })}>PLACE</th>
              <th style={th({ fontSize: 7 })}>DATE</th>
              <th style={th({ fontSize: 7 })}>HOUR</th>
              <th style={th({ fontSize: 7 })}>STANDARD</th>
              <th style={th({ fontSize: 7 })}>SUB-STANDARD</th>
              <th style={th({ fontSize: 7 })}></th>
              <th style={th({ fontSize: 7 })}></th>
            </tr>
          </thead>
          <tbody>
            {itinRows.map((row, i) => (
              <tr key={i}>
                <td style={td({ textAlign: "center", color: "#888", fontSize: 7 })}>{i + 1}</td>
                <td style={td()}>{row?.depPlace || ""}</td>
                <td style={td({ textAlign: "center" })}>{row?.depDate || ""}</td>
                <td style={td({ textAlign: "center" })}>{row?.depHour || ""}</td>
                <td style={td()}>{row?.arrPlace || ""}</td>
                <td style={td({ textAlign: "center" })}>{row?.arrDate || ""}</td>
                <td style={td({ textAlign: "center" })}>{row?.arrHour || ""}</td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{row?.mileageStandard ? row.mileageStandard.toFixed(2) : ""}</td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{row?.mileageSubstandard ? row.mileageSubstandard.toFixed(2) : ""}</td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{row?.radius ? row.radius.toFixed(2) : ""}</td>
                <td style={td({ textAlign: "right", fontFamily: "monospace" })}>{row?.conveyanceAmount ? row.conveyanceAmount.toFixed(2) : ""}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} style={td({ textAlign: "right", fontWeight: "bold", background: "#e8e8e8" })}>TOTAL MILEAGE</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace", fontWeight: "bold", background: "#e8e8e8" })}>{totalMileageStd.toFixed(2)}</td>
              <td style={td({ textAlign: "right", fontFamily: "monospace", fontWeight: "bold", background: "#e8e8e8" })}>{totalMileageSub.toFixed(2)}</td>
              <td style={td({ background: "#e8e8e8" })}></td>
              <td style={td({ textAlign: "right", fontFamily: "monospace", fontWeight: "bold", background: "#e8e8e8" })}>{totalConveyance.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Signatures */}
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, fontSize: 9 }}>
          {["CLAIMANT", "RECOMMENDED BY", "APPROVED BY"].map((label) => (
            <div key={label}>
              <div style={{ borderTop: "1px solid #000", paddingTop: 2, marginTop: 32, textAlign: "center", fontWeight: "bold" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Print CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #gwl-page-1, #gwl-page-1 *,
          #gwl-page-2, #gwl-page-2 * { visibility: visible; }
          #gwl-toolbar { display: none !important; }
          #gwl-page-1 {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm 14mm !important;
            border: none !important;
            box-shadow: none !important;
            page-break-after: always;
          }
          #gwl-page-2 {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm 14mm !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      ` }} />
    </>
  );
}