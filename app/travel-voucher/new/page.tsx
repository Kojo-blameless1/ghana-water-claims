"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormValues = {
  employee: string;
  post: string;
  district: string;
  activity: string;
  purpose: string;
  allowanceMonth: string;
  hotelNights: number;
  hotelPerNight: number;
  byAir: number;
  byRail: number;
  privateVehicleMiles: number;
  privateVehicleRate: number;
  tolls: number;
  miscellaneous: number;
  accountCode: string;
  date: string;
};

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

const emptyRow = (): ItineraryRow => ({
  depPlace: "", depDate: "", depHour: "",
  arrPlace: "", arrDate: "", arrHour: "",
  mileageStandard: 0, mileageSubstandard: 0,
  radius: 0, conveyanceAmount: 0,
});

export default function NewTravelVoucher() {
  const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm<FormValues>();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<ItineraryRow[]>([emptyRow(), emptyRow(), emptyRow()]);

  const n = (v: unknown) => (isNaN(Number(v)) ? 0 : Number(v));
  const hotelActual = n(watch("hotelNights")) * n(watch("hotelPerNight"));
  const vehicleTotal = n(watch("privateVehicleMiles")) * n(watch("privateVehicleRate"));
  const total = hotelActual + n(watch("byAir")) + n(watch("byRail")) + vehicleTotal + n(watch("tolls")) + n(watch("miscellaneous"));

  const totalMileageStandard = rows.reduce((s, r) => s + (r.mileageStandard || 0), 0);
  const totalMileageSubstandard = rows.reduce((s, r) => s + (r.mileageSubstandard || 0), 0);
  const totalConveyance = rows.reduce((s, r) => s + (r.conveyanceAmount || 0), 0);

  const addRow = () => setRows([...rows, emptyRow()]);
  const removeRow = (idx: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== idx));
  };
  const updateRow = (idx: number, field: keyof ItineraryRow, value: string | number) => {
    const updated = [...rows];
    updated[idx] = { ...updated[idx], [field]: value };
    setRows(updated);
  };

  const goToStep2 = handleSubmit(() => setStep(2));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const voucherData = getValues();
      const res = await fetch("/api/travel-voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...voucherData,
          hotelNights: n(voucherData.hotelNights),
          hotelPerNight: n(voucherData.hotelPerNight),
          byAir: n(voucherData.byAir),
          byRail: n(voucherData.byRail),
          privateVehicleMiles: n(voucherData.privateVehicleMiles),
          privateVehicleRate: n(voucherData.privateVehicleRate),
          tolls: n(voucherData.tolls),
          miscellaneous: n(voucherData.miscellaneous),
          hotelActual,
          totalAmount: total,
          itineraryEntries: rows,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setSavedId(json.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Shared styles ── */
  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #dce7ff", borderRadius: 6,
    padding: "9px 11px", fontSize: 13, outline: "none",
    background: "#fff", color: "#0a2540", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, color: "#475569",
    marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em",
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
  const readonlyStyle: React.CSSProperties = {
    border: "1.5px solid #dce7ff", borderRadius: 6, padding: "9px 11px",
    fontSize: 13, background: "#f0f4ff", color: "#0a2540",
    fontFamily: "monospace", fontWeight: 600,
  };
  const thGroup: React.CSSProperties = {
    background: "#0052cc", color: "#fff", fontWeight: 700,
    fontSize: 11, padding: "9px 8px", textAlign: "center",
    border: "1px solid #0041a8",
  };
  const thSub: React.CSSProperties = {
    background: "#1a6bff", color: "#fff", fontWeight: 500,
    fontSize: 10, padding: "6px 6px", textAlign: "center",
    border: "1px solid #0041a8",
  };
  const td: React.CSSProperties = {
    border: "1px solid #dce7ff", padding: "4px 5px", verticalAlign: "middle",
  };
  const cellInput: React.CSSProperties = {
    width: "100%", border: "1.5px solid #dce7ff", borderRadius: 5,
    padding: "5px 7px", fontSize: 12, outline: "none",
    background: "#fff", color: "#0a2540", boxSizing: "border-box",
  };

  /* ── Success screen ── */
  if (savedId) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,82,204,0.10)", maxWidth: 380, width: "100%", border: "1px solid #dce7ff" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e8f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, color: "#0052cc" }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>Voucher Saved</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Travel voucher and itinerary recorded successfully.</p>
          <button
            onClick={() => router.push(`/travel-voucher/${savedId}`)}
            style={{ width: "100%", background: "#0052cc", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10 }}
          >
            View &amp; Print (Both Pages)
          </button>
          <button
            onClick={() => { setSavedId(null); setStep(1); setRows([emptyRow(), emptyRow(), emptyRow()]); }}
            style={{ width: "100%", background: "transparent", color: "#0052cc", border: "1.5px solid #0052cc", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Enter Another Voucher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Nav bar ── */}
      <div style={{ background: "#0052cc", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <img src="/logo.png" alt="GWL" style={{ height: 36, width: 36, objectFit: "contain", borderRadius: 4 }} />
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.25)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Ghana Water Limited</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Ashanti South Region</div>
        </div>
        <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)" }}>
          Travel Expense Voucher
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #dce7ff", padding: "14px 32px", display: "flex", alignItems: "center", gap: 12 }}>
        {[{ n: 1, label: "Voucher Details" }, { n: 2, label: "Itinerary" }].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <div style={{ width: 40, height: 2, background: step > i ? "#0052cc" : "#dce7ff" }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                background: step === s.n ? "#0052cc" : step > s.n ? "#0052cc" : "#e8f0ff",
                color: step >= s.n ? "#fff" : "#0052cc",
              }}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 500, color: step === s.n ? "#0052cc" : "#94a3b8" }}>
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* ══════════════ STEP 1: VOUCHER ══════════════ */}
        {step === 1 && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>New Travel Expense Voucher</h1>
              <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Complete the voucher details, then proceed to the itinerary.</p>
            </div>

            {/* Employee Details */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>① Employee Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Employee Name</label>
                  <input {...register("employee", { required: true })} style={inputStyle} placeholder="Full name" />
                  {errors.employee && <span style={{ color: "#dc2626", fontSize: 11 }}>Required</span>}
                </div>
                <div>
                  <label style={labelStyle}>Post / Title</label>
                  <input {...register("post")} style={inputStyle} placeholder="e.g. Engineer" />
                </div>
                <div>
                  <label style={labelStyle}>District</label>
                  <input {...register("district")} style={inputStyle} placeholder="e.g. Obuasi" />
                </div>
                <div>
                  <label style={labelStyle}>Activity</label>
                  <input {...register("activity")} style={inputStyle} placeholder="Activity description" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Purpose of Travel</label>
                  <input {...register("purpose")} style={inputStyle} placeholder="State the purpose clearly" />
                </div>
                <div>
                  <label style={labelStyle}>Allowance for the Month</label>
                  <input {...register("allowanceMonth")} style={inputStyle} placeholder="e.g. June 2026" />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" {...register("date")} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Lodging */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>② Hotel / Guest House Lodging</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "end" }}>
                <div>
                  <label style={labelStyle}>Number of Nights</label>
                  <input type="number" min={0} {...register("hotelNights")} style={inputStyle} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Rate per Night (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("hotelPerNight")} style={inputStyle} placeholder="0.00" />
                </div>
                <div>
                  <label style={labelStyle}>Lodging Actual (auto)</label>
                  <div style={readonlyStyle}>GH¢ {hotelActual.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Direct Travel Costs */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>③ Direct Travel Costs</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>By Air (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("byAir")} style={inputStyle} placeholder="0.00" />
                </div>
                <div>
                  <label style={labelStyle}>By Rail (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("byRail")} style={inputStyle} placeholder="0.00" />
                </div>
                <div>
                  <label style={labelStyle}>Private Vehicle — Miles</label>
                  <input type="number" min={0} {...register("privateVehicleMiles")} style={inputStyle} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Rate per Mile (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("privateVehicleRate")} style={inputStyle} placeholder="0.00" />
                </div>
                {vehicleTotal > 0 && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ background: "#e8f0ff", borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#0052cc", fontWeight: 600 }}>
                      Vehicle subtotal: <span style={{ fontFamily: "monospace" }}>GH¢ {vehicleTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Tolls etc. (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("tolls")} style={inputStyle} placeholder="0.00" />
                </div>
                <div>
                  <label style={labelStyle}>Miscellaneous (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("miscellaneous")} style={inputStyle} placeholder="0.00" />
                </div>
              </div>
            </div>

            {/* Account & Total */}
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>④ Account Code &amp; Total</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "end" }}>
                <div>
                  <label style={labelStyle}>Account Code</label>
                  <input {...register("accountCode")} style={inputStyle} placeholder="Account / code" />
                </div>
                <div>
                  <label style={labelStyle}>Total Amount (auto)</label>
                  <div style={{ border: "2px solid #0052cc", borderRadius: 8, padding: "10px 14px", background: "#e8f0ff", color: "#0052cc", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>
                    GH¢ {total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={goToStep2}
                style={{ background: "#0052cc", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,82,204,0.35)" }}
              >
                Next: Itinerary →
              </button>
            </div>
          </>
        )}

        {/* ══════════════ STEP 2: ITINERARY ══════════════ */}
        {step === 2 && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>Itinerary</h1>
              <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Enter each leg of the journey. This will print as page 2 of the voucher.</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #dce7ff", boxShadow: "0 1px 8px rgba(0,82,204,0.06)", padding: "24px 28px", marginBottom: 20 }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 10, borderBottom: "2px solid #e8f0ff" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0052cc", textTransform: "uppercase", letterSpacing: "0.08em" }}>Journey Entries</span>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
                    <div style={{ width: 14, height: 14, background: "#f8faff", border: "1px solid #dce7ff", borderRadius: 3 }} /> Departure
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
                    <div style={{ width: 14, height: 14, background: "#f0f4ff", border: "1px solid #dce7ff", borderRadius: 3 }} /> Arrival
                  </div>
                </div>
                <span style={{ background: "#e8f0ff", color: "#0052cc", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                  {rows.length} row{rows.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 980 }}>
                  <thead>
                    <tr>
                      <th style={{ ...thGroup, width: 28 }}>#</th>
                      <th style={thGroup} colSpan={3}>Departure From</th>
                      <th style={thGroup} colSpan={3}>Arrival At</th>
                      <th style={thGroup} colSpan={2}>Mileage</th>
                      <th style={thGroup}>Radius</th>
                      <th style={thGroup}>Means of Conveyance (GH¢)</th>
                      <th style={{ ...thGroup, width: 36 }}></th>
                    </tr>
                    <tr>
                      <th style={thSub}></th>
                      <th style={thSub}>Place</th>
                      <th style={thSub}>Date</th>
                      <th style={thSub}>Hour</th>
                      <th style={thSub}>Place</th>
                      <th style={thSub}>Date</th>
                      <th style={thSub}>Hour</th>
                      <th style={thSub}>Standard</th>
                      <th style={thSub}>Sub-standard</th>
                      <th style={thSub}></th>
                      <th style={thSub}></th>
                      <th style={thSub}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f8faff" }}>
                        <td style={{ ...td, textAlign: "center", color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ ...td, background: "#f8faff" }}><input value={row.depPlace} onChange={e => updateRow(idx, "depPlace", e.target.value)} style={cellInput} placeholder="e.g. Kumasi" /></td>
                        <td style={{ ...td, background: "#f8faff" }}><input type="date" value={row.depDate} onChange={e => updateRow(idx, "depDate", e.target.value)} style={cellInput} /></td>
                        <td style={{ ...td, background: "#f8faff" }}><input type="time" value={row.depHour} onChange={e => updateRow(idx, "depHour", e.target.value)} style={cellInput} /></td>
                        <td style={{ ...td, background: "#f0f4ff" }}><input value={row.arrPlace} onChange={e => updateRow(idx, "arrPlace", e.target.value)} style={{ ...cellInput, background: "transparent" }} placeholder="e.g. Obuasi" /></td>
                        <td style={{ ...td, background: "#f0f4ff" }}><input type="date" value={row.arrDate} onChange={e => updateRow(idx, "arrDate", e.target.value)} style={{ ...cellInput, background: "transparent" }} /></td>
                        <td style={{ ...td, background: "#f0f4ff" }}><input type="time" value={row.arrHour} onChange={e => updateRow(idx, "arrHour", e.target.value)} style={{ ...cellInput, background: "transparent" }} /></td>
                        <td style={td}><input type="number" value={row.mileageStandard || ""} onChange={e => updateRow(idx, "mileageStandard", parseFloat(e.target.value) || 0)} style={{ ...cellInput, textAlign: "right" }} placeholder="0" /></td>
                        <td style={td}><input type="number" value={row.mileageSubstandard || ""} onChange={e => updateRow(idx, "mileageSubstandard", parseFloat(e.target.value) || 0)} style={{ ...cellInput, textAlign: "right" }} placeholder="0" /></td>
                        <td style={td}><input type="number" value={row.radius || ""} onChange={e => updateRow(idx, "radius", parseFloat(e.target.value) || 0)} style={{ ...cellInput, textAlign: "right" }} placeholder="0" /></td>
                        <td style={td}><input type="number" step="0.01" value={row.conveyanceAmount || ""} onChange={e => updateRow(idx, "conveyanceAmount", parseFloat(e.target.value) || 0)} style={{ ...cellInput, textAlign: "right" }} placeholder="0.00" /></td>
                        <td style={{ ...td, textAlign: "center" }}>
                          {rows.length > 1 && (
                            <button type="button" onClick={() => removeRow(idx)} style={{ background: "#fee2e2", border: "none", borderRadius: 4, color: "#dc2626", fontWeight: 700, fontSize: 14, width: 24, height: 24, cursor: "pointer" }}>×</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7} style={{ border: "1px solid #dce7ff", padding: "8px 12px", textAlign: "right", fontWeight: 700, fontSize: 12, color: "#0052cc", background: "#e8f0ff", letterSpacing: "0.04em" }}>
                        TOTAL MILEAGE
                      </td>
                      <td style={{ ...td, background: "#e8f0ff", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>{totalMileageStandard.toFixed(2)}</td>
                      <td style={{ ...td, background: "#e8f0ff", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>{totalMileageSubstandard.toFixed(2)}</td>
                      <td style={{ ...td, background: "#e8f0ff" }}></td>
                      <td style={{ ...td, background: "#e8f0ff", textAlign: "right", fontWeight: 700, color: "#0052cc", fontFamily: "monospace" }}>GH¢ {totalConveyance.toFixed(2)}</td>
                      <td style={{ ...td, background: "#e8f0ff" }}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <button
                type="button"
                onClick={addRow}
                style={{ marginTop: 14, border: "1.5px dashed #0052cc", color: "#0052cc", background: "transparent", fontSize: 12, fontWeight: 600, padding: "7px 18px", borderRadius: 6, cursor: "pointer" }}
              >
                + Add Row
              </button>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 8, padding: "10px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: "transparent", color: "#0052cc", border: "1.5px solid #0052cc", borderRadius: 8, padding: "11px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                ← Back to Voucher
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{ background: saving ? "#7aa7e0" : "#0052cc", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(0,82,204,0.35)" }}
              >
                {saving ? "Saving…" : "Save & Print Both Pages →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}