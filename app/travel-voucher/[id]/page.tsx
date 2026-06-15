"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Voucher = {
  id: number;
  employee: string;
  post: string;
  district: string;
  activity: string;
  purpose: string;
  allowanceMonth: string;
  hotelNights: number | null;
  hotelPerNight: number | null;
  hotelActual: number | null;
  byAir: number | null;
  byRail: number | null;
  privateVehicleMiles: number | null;
  privateVehicleRate: number | null;
  tolls: number | null;
  miscellaneous: number | null;
  totalAmount: number;
  accountCode: string | null;
  date: string | null;
};

const fmt = (n: number | null | undefined) =>
  n != null && n !== 0 ? n.toFixed(2) : "";

export default function ViewTravelVoucher() {
  const params = useParams();
  const id = params?.id;
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/travel-voucher/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.error) {
          setFetchError(d.error);
          setLoading(false);
        } else {
          setVoucher(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        setFetchError(e.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: "sans-serif",
          color: "#555",
        }}
      >
        Loading voucher…
      </div>
    );
  if (fetchError)
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: "sans-serif",
          color: "red",
        }}
      >
        Error: {fetchError}
      </div>
    );
  if (!voucher)
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontFamily: "sans-serif",
          color: "red",
        }}
      >
        Voucher not found.
      </div>
    );

  const vehicleTotal =
    (voucher.privateVehicleMiles || 0) * (voucher.privateVehicleRate || 0);

  const page: React.CSSProperties = {
    maxWidth: 720,
    margin: "24px auto 48px",
    padding: "36px 48px",
    background: "#fff",
    border: "1px solid #ccc",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: 10,
    color: "#000",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
  };

  // Field row: label on left, value sits ON the underline
  const FieldRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 6 }}>
      <span
        style={{
          fontWeight: "bold",
          whiteSpace: "nowrap",
          minWidth: 220,
          fontSize: 10,
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          borderBottom: "1px solid #000",
          paddingLeft: 4,
          paddingBottom: 1,
          fontSize: 10,
          minHeight: 17,
          lineHeight: "17px",
        }}
      >
        {value}
      </span>
    </div>
  );

  const tbl: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "12px 0 8px",
    fontSize: 9.5,
  };
  const th = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #000",
    padding: "3px 5px",
    textAlign: "center",
    fontWeight: "bold",
    background: "#efefef",
    fontSize: 9,
    ...extra,
  });
  const td = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #000",
    padding: "3px 6px",
    fontSize: 9.5,
    ...extra,
  });
  const tdR = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    ...td(),
    textAlign: "right",
    fontFamily: "monospace",
    ...extra,
  });

  // Signature row: DATE line on left, role bold on right
  const SigRow = ({ role }: { role: string }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderBottom: "1px dotted #000",
        paddingBottom: 2,
        marginTop: 16,
        fontSize: 9,
      }}
    >
      <span>DATE ................................</span>
      <span style={{ fontWeight: "bold" }}>{role}</span>
    </div>
  );

  return (
    <>
      {/* Screen toolbar */}
      <div
        id="gwl-toolbar"
        style={{
          background: "#3937b5",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
          GWL Travel Voucher #{voucher.id}
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
              color: "#0e740b",
              fontWeight: 700,
              padding: "4px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              border: "none",
            }}
          >
            🖨 Print Voucher
          </button>
        </div>
      </div>

      {/* Printable document */}
      <div id="gwl-print-page" style={page}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <img
            src="/logo.png"
            alt="GWL Logo"
            style={{ width: 64, height: 64, objectFit: "contain" }}
          />
          <div style={{ textAlign: "center", flex: 1 }}>
            <div
              style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
            >
              GHANA WATER LIMITED
            </div>
            <div style={{ fontSize: 12 }}>ASHANTI SOUTH REGION</div>
            <div
              style={{
                fontSize: 12,
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              TRAVEL EXPENSE VOUCHER
            </div>
          </div>
          <div style={{ fontSize: 9, textAlign: "right", lineHeight: 1.9 }}>
            <div>Original</div>
            <div>Duplicate</div>
          </div>
        </div>

        <hr style={{ borderTop: "1.5px solid #000", margin: "8px 0 10px" }} />

        {/* Employee fields — value sits on the line */}
        <FieldRow label="EMPLOYEE:" value={voucher.employee} />
        <FieldRow label="POST:" value={voucher.post} />
        <FieldRow label="DISTRICT:" value={voucher.district} />
        <FieldRow label="ACTIVITY:" value={voucher.activity || ""} />
        <FieldRow label="PURPOSE OF TRAVEL:" value={voucher.purpose} />
        <FieldRow
          label="ALLOWANCE FOR THE MONTH:"
          value={voucher.allowanceMonth}
        />

        {/* Expense table */}
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th({ width: "38%", textAlign: "left" })}></th>
              <th style={th({ width: "44%" })}></th>
              <th style={th({ width: "18%" })}>Actual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...td(), fontStyle: "italic" }}>
                Hotel/Guest House
              </td>
              <td style={td()}>
                {voucher.hotelNights ?? "........"} Nights &nbsp;&nbsp; GH¢{" "}
                {fmt(voucher.hotelPerNight) || "............"} &nbsp; per day
                Lodging
              </td>
              <td style={tdR()}>{fmt(voucher.hotelActual)}</td>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ ...td(), fontWeight: "bold", background: "#f8f8f8" }}
              >
                Direct Travel Cost
              </td>
              <td style={td()}></td>
            </tr>
            <tr>
              <td style={{ ...td(), fontStyle: "italic", paddingLeft: 14 }}>
                By Air
              </td>
              <td style={td()}>GH¢ &nbsp; {fmt(voucher.byAir)}</td>
              <td style={tdR()}></td>
            </tr>
            <tr>
              <td style={{ ...td(), fontStyle: "italic", paddingLeft: 14 }}>
                By Rail
              </td>
              <td style={td()}>GH¢ &nbsp; {fmt(voucher.byRail)}</td>
              <td style={tdR()}></td>
            </tr>
            <tr>
              <td style={{ ...td(), fontStyle: "italic", paddingLeft: 14 }}>
                By Private Vehicle
              </td>
              <td style={td()}>
                {voucher.privateVehicleMiles ?? "......"} Miles &nbsp; at &nbsp;
                GH¢ {fmt(voucher.privateVehicleRate) || "......"} &nbsp; per
                mile
              </td>
              <td style={tdR()}>
                {vehicleTotal > 0 ? vehicleTotal.toFixed(2) : ""}
              </td>
            </tr>
            <tr>
              <td style={{ ...td(), fontStyle: "italic", paddingLeft: 14 }}>
                Toll, etc.
              </td>
              <td style={td()}>GH¢ &nbsp; {fmt(voucher.tolls)}</td>
              <td style={tdR()}></td>
            </tr>
            <tr>
              <td style={{ ...td(), fontStyle: "italic", paddingLeft: 14 }}>
                Miscellaneous
              </td>
              <td style={td()}>GH¢ &nbsp; {fmt(voucher.miscellaneous)}</td>
              <td style={tdR()}></td>
            </tr>
            <tr>
              <td style={td()}></td>
              <td style={td()}>GH¢</td>
              <td style={tdR()}></td>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ ...td(), textAlign: "right", fontStyle: "italic" }}
              >
                Miscellaneous
              </td>
              <td style={tdR()}>{fmt(voucher.miscellaneous)}</td>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ ...td(), textAlign: "right", fontWeight: "bold" }}
              >
                TOTAL
              </td>
              <td style={{ ...tdR(), fontWeight: "bold" }}>
                {voucher.totalAmount?.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Account & Code */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 8,
            fontSize: 9.5,
          }}
        >
          <span style={{ fontWeight: "bold" }}>Account</span>
          <span
            style={{
              border: "1px solid #000",
              minWidth: 100,
              height: 20,
              display: "inline-flex",
              alignItems: "center",
              padding: "0 4px",
              fontSize: 9.5,
            }}
          >
            {voucher.accountCode || ""}
          </span>
          <span style={{ fontWeight: "bold" }}>Code</span>
          <span
            style={{
              border: "1px solid #000",
              minWidth: 80,
              height: 20,
              display: "inline-block",
            }}
          ></span>
        </div>

        {/* Date + Claimant */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 16,
            fontSize: 9.5,
          }}
        >
          <span>
            DATE: {voucher.date || "........................"} &nbsp;&nbsp;
            20......
          </span>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                borderBottom: "1px dotted #000",
                minWidth: 200,
                marginBottom: 2,
              }}
            >
              &nbsp;
            </div>
            <strong style={{ fontSize: 9 }}>CLAIMANT</strong>
          </div>
        </div>

        <hr style={{ borderTop: "1px solid #000", margin: "14px 0 4px" }} />

        {/* Signature rows */}
        <SigRow role="D.D.O. / D.C.O." />
        <SigRow role="DISTRICT/UNIT HEAD" />
        <SigRow role="SECTIONAL HEAD" />
        <SigRow role="REGIONAL CHIEF MANAGER" />
        <div style={{ fontSize: 9, marginTop: 6, fontStyle: "italic" }}>
          Approved &nbsp;&nbsp; DATE ..............................
        </div>

        <hr style={{ borderTop: "1px solid #000", margin: "14px 0 8px" }} />

        {/* Receipt */}
        <div style={{ fontSize: 9, lineHeight: 2.2 }}>
          Received this .................. day of
          .................................. 20...... in payment of the above
          account the sum of ............................................
        </div>
        <div
          style={{
            borderTop: "1px dotted #000",
            marginTop: 12,
            paddingTop: 4,
            fontSize: 9,
          }}
        >
          Witness to Mark and Payments ..................................
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 14,
            fontSize: 9,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderBottom: "1px dotted #000",
                minWidth: 220,
                marginBottom: 3,
              }}
            >
              &nbsp;
            </div>
            <div>
              <strong>Signature of Receiver</strong>
            </div>
            <div>
              <strong>G.W.L. ACCTS. FORMS 8</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Print CSS */}
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
            padding: 14mm 20mm !important;
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
