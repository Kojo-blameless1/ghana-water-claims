"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, DISTRICTS, MONTHS } from "@/lib/api";

type FormValues = {
  employee: string; post: string; district: string; activity: string;
  purpose: string; allowanceMonth: string; tripType: string;
  hotelNights: number; hotelPerNight: number;
  byAir: number; byRail: number; privateVehicleMiles: number;
  privateVehicleRate: number; tolls: number; miscellaneous: number;
  accountCode: string; date: string;
};

type ItineraryRow = {
  depPlace: string; depDate: string; depHour: string;
  arrPlace: string; arrDate: string; arrHour: string;
  mileageStandard: number; mileageSubstandard: number;
  radius: number; conveyanceAmount: number;
};

const emptyRow = (): ItineraryRow => ({
  depPlace: "", depDate: "", depHour: "",
  arrPlace: "", arrDate: "", arrHour: "",
  mileageStandard: 0, mileageSubstandard: 0, radius: 0, conveyanceAmount: 0,
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
  const tripType = watch("tripType");
  const isNight = tripType === "Night Trip";
  const hotelActual = isNight ? n(watch("hotelNights")) * n(watch("hotelPerNight")) : 0;
  const vehicleTotal = n(watch("privateVehicleMiles")) * n(watch("privateVehicleRate"));
  const total = hotelActual + n(watch("byAir")) + n(watch("byRail")) + vehicleTotal + n(watch("tolls")) + n(watch("miscellaneous"));
  const totalMileageStd = rows.reduce((s, r) => s + (r.mileageStandard || 0), 0);
  const totalMileageSub = rows.reduce((s, r) => s + (r.mileageSubstandard || 0), 0);
  const totalConveyance = rows.reduce((s, r) => s + (r.conveyanceAmount || 0), 0);

  const addRow = () => setRows([...rows, emptyRow()]);
  const removeRow = (i: number) => { if (rows.length > 1) setRows(rows.filter((_, idx) => idx !== i)); };
  const updateRow = (i: number, f: keyof ItineraryRow, v: string | number) => {
    const u = [...rows]; u[i] = { ...u[i], [f]: v }; setRows(u);
  };

  const goToStep2 = handleSubmit(() => setStep(2));

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      const d = getValues();
      const res = await api("/api/vouchers", {
        method: "POST",
        body: JSON.stringify({
          ...d,
          hotelNights: isNight ? n(d.hotelNights) : 0,
          hotelPerNight: isNight ? n(d.hotelPerNight) : 0,
          byAir: n(d.byAir), byRail: n(d.byRail),
          privateVehicleMiles: n(d.privateVehicleMiles), privateVehicleRate: n(d.privateVehicleRate),
          tolls: n(d.tolls), miscellaneous: n(d.miscellaneous),
          hotelActual, totalAmount: total, itineraryEntries: rows,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setSavedId(json.id);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const inp: React.CSSProperties = { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", background: "#fff", color: "#0a2540", boxSizing: "border-box" };
  const sel: React.CSSProperties = { ...inp, cursor: "pointer" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" };
  const sec: React.CSSProperties = { background: "#fff", borderRadius: 12, padding: "22px 26px", marginBottom: 18, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" };
  const secTitle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, paddingBottom: 10, borderBottom: "1.5px solid #eff6ff" };
  const readonly: React.CSSProperties = { border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, background: "#f0f9ff", color: "#0a2540", fontFamily: "monospace", fontWeight: 600 };
  const thG: React.CSSProperties = { background: "#1d4ed8", color: "#fff", fontWeight: 700, fontSize: 11, padding: "8px 6px", textAlign: "center", border: "1px solid #1e40af" };
  const thS: React.CSSProperties = { background: "#3b82f6", color: "#fff", fontWeight: 500, fontSize: 10, padding: "5px 5px", textAlign: "center", border: "1px solid #1e40af" };
  const tdS: React.CSSProperties = { border: "1px solid #e2e8f0", padding: "4px 5px", verticalAlign: "middle" };
  const ci: React.CSSProperties = { width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "5px 6px", fontSize: 12, outline: "none", background: "#fff", color: "#0a2540", boxSizing: "border-box" };

  if (savedId) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", textAlign: "center", maxWidth: 380, width: "100%", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, color: "#1d4ed8" }}>✓</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>Voucher Saved</h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Travel voucher and itinerary recorded successfully.</p>
        <button onClick={() => router.push(`/travel-voucher/${savedId}`)} style={{ width: "100%", background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10 }}>
          View &amp; Print (Both Pages)
        </button>
        <button onClick={() => { setSavedId(null); setStep(1); setRows([emptyRow(), emptyRow(), emptyRow()]); }} style={{ width: "100%", background: "transparent", color: "#1d4ed8", border: "1.5px solid #1d4ed8", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Enter Another Voucher
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Nav */}
      <div style={{ background: "#1d4ed8", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <img src="/logo.png" alt="GWL" style={{ height: 34, objectFit: "contain" }} />
        <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.2)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Ghana Water Limited</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Ashanti South Region</div>
        </div>
        <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.25)" }}>Travel Expense Voucher</span>
      </div>

      {/* Step indicator */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "13px 32px", display: "flex", alignItems: "center", gap: 12 }}>
        {[{ n: 1, label: "Voucher Details" }, { n: 2, label: "Itinerary" }].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <div style={{ width: 40, height: 2, background: step > i ? "#1d4ed8" : "#e2e8f0" }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: step >= s.n ? "#1d4ed8" : "#eff6ff", color: step >= s.n ? "#fff" : "#1d4ed8" }}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 400, color: step === s.n ? "#1d4ed8" : "#94a3b8" }}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 24px 60px" }}>

        {step === 1 && (
          <>
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>New Travel Expense Voucher</h1>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Complete voucher details then proceed to the itinerary.</p>
            </div>

            {/* Employee Details */}
            <div style={sec}>
              <div style={secTitle}>① Employee Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={lbl}>Employee Name</label>
                  <input {...register("employee", { required: true })} style={inp} placeholder="Full name" />
                  {errors.employee && <span style={{ color: "#dc2626", fontSize: 11 }}>Required</span>}
                </div>
                <div>
                  <label style={lbl}>Post / Title</label>
                  <input {...register("post")} style={inp} placeholder="e.g. Engineer" />
                </div>
                <div>
                  <label style={lbl}>District</label>
                  <select {...register("district")} style={sel}>
                    <option value="">Select district…</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Allowance Month</label>
                  <select {...register("allowanceMonth")} style={sel}>
                    <option value="">Select month…</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Activity</label>
                  <input {...register("activity")} style={inp} placeholder="Activity description" />
                </div>
                <div>
                  <label style={lbl}>Date</label>
                  <input type="date" {...register("date")} style={inp} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Purpose of Travel</label>
                  <input {...register("purpose")} style={inp} placeholder="State the purpose clearly" />
                </div>
                <div>
                  <label style={lbl}>Trip Type</label>
                  <select {...register("tripType")} style={sel}>
                    <option value="">Select trip type…</option>
                    <option value="Day Trip">Day Trip</option>
                    <option value="Night Trip">Night Trip</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hotel — only if Night Trip */}
            {isNight && (
              <div style={sec}>
                <div style={secTitle}>② Hotel / Guest House Lodging</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, alignItems: "end" }}>
                  <div>
                    <label style={lbl}>Number of Nights</label>
                    <input type="number" min={0} {...register("hotelNights")} style={inp} placeholder="0" />
                  </div>
                  <div>
                    <label style={lbl}>Rate per Night (GH¢)</label>
                    <input type="number" step="0.01" min={0} {...register("hotelPerNight")} style={inp} placeholder="0.00" />
                  </div>
                  <div>
                    <label style={lbl}>Lodging Actual (auto)</label>
                    <div style={readonly}>GH¢ {hotelActual.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Travel Costs */}
            <div style={sec}>
              <div style={secTitle}>{isNight ? "③" : "②"} Direct Travel Costs</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={lbl}>By Air (GH¢)</label><input type="number" step="0.01" min={0} {...register("byAir")} style={inp} placeholder="0.00" /></div>
                <div><label style={lbl}>By Rail (GH¢)</label><input type="number" step="0.01" min={0} {...register("byRail")} style={inp} placeholder="0.00" /></div>
                <div><label style={lbl}>Private Vehicle — Miles</label><input type="number" min={0} {...register("privateVehicleMiles")} style={inp} placeholder="0" /></div>
                <div><label style={lbl}>Rate per Mile (GH¢)</label><input type="number" step="0.01" min={0} {...register("privateVehicleRate")} style={inp} placeholder="0.00" /></div>
                {vehicleTotal > 0 && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ background: "#eff6ff", borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#1d4ed8", fontWeight: 600 }}>
                      Vehicle subtotal: <span style={{ fontFamily: "monospace" }}>GH¢ {vehicleTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <div><label style={lbl}>Tolls etc. (GH¢)</label><input type="number" step="0.01" min={0} {...register("tolls")} style={inp} placeholder="0.00" /></div>
                <div><label style={lbl}>Miscellaneous (GH¢)</label><input type="number" step="0.01" min={0} {...register("miscellaneous")} style={inp} placeholder="0.00" /></div>
              </div>
            </div>

            {/* Account & Total */}
            <div style={sec}>
              <div style={secTitle}>{isNight ? "④" : "③"} Account Code &amp; Total</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "end" }}>
                <div><label style={lbl}>Account Code</label><input {...register("accountCode")} style={inp} placeholder="Account / code" /></div>
                <div>
                  <label style={lbl}>Total Amount (auto)</label>
                  <div style={{ border: "2px solid #1d4ed8", borderRadius: 8, padding: "9px 13px", background: "#eff6ff", color: "#1d4ed8", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>
                    GH¢ {total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" onClick={goToStep2} style={{ background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(29,78,216,0.3)" }}>
                Next: Itinerary →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>Itinerary</h1>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Enter each leg of the journey. Prints as page 2 of the voucher.</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", padding: "22px 26px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 10, borderBottom: "1.5px solid #eff6ff" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Journey Entries</span>
                <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{rows.length} rows</span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 980 }}>
                  <thead>
                    <tr>
                      <th style={{ ...thG, width: 28 }}>#</th>
                      <th style={thG} colSpan={3}>Departure From</th>
                      <th style={thG} colSpan={3}>Arrival At</th>
                      <th style={thG} colSpan={2}>Mileage</th>
                      <th style={thG}>Radius</th>
                      <th style={thG}>Conveyance (GH¢)</th>
                      <th style={{ ...thG, width: 32 }}></th>
                    </tr>
                    <tr>
                      <th style={thS}></th>
                      <th style={thS}>Place</th><th style={thS}>Date</th><th style={thS}>Hour</th>
                      <th style={thS}>Place</th><th style={thS}>Date</th><th style={thS}>Hour</th>
                      <th style={thS}>Standard</th><th style={thS}>Sub-std</th>
                      <th style={thS}></th><th style={thS}></th><th style={thS}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                        <td style={{ ...tdS, textAlign: "center", color: "#94a3b8", fontSize: 11 }}>{idx + 1}</td>
                        <td style={{ ...tdS, background: "#f0f9ff" }}><input value={row.depPlace} onChange={e => updateRow(idx, "depPlace", e.target.value)} style={ci} placeholder="e.g. Kumasi" /></td>
                        <td style={{ ...tdS, background: "#f0f9ff" }}><input type="date" value={row.depDate} onChange={e => updateRow(idx, "depDate", e.target.value)} style={ci} /></td>
                        <td style={{ ...tdS, background: "#f0f9ff" }}><input type="time" value={row.depHour} onChange={e => updateRow(idx, "depHour", e.target.value)} style={ci} /></td>
                        <td style={{ ...tdS, background: "#eff6ff" }}><input value={row.arrPlace} onChange={e => updateRow(idx, "arrPlace", e.target.value)} style={{ ...ci, background: "transparent" }} placeholder="e.g. Obuasi" /></td>
                        <td style={{ ...tdS, background: "#eff6ff" }}><input type="date" value={row.arrDate} onChange={e => updateRow(idx, "arrDate", e.target.value)} style={{ ...ci, background: "transparent" }} /></td>
                        <td style={{ ...tdS, background: "#eff6ff" }}><input type="time" value={row.arrHour} onChange={e => updateRow(idx, "arrHour", e.target.value)} style={{ ...ci, background: "transparent" }} /></td>
                        <td style={tdS}><input type="number" value={row.mileageStandard || ""} onChange={e => updateRow(idx, "mileageStandard", parseFloat(e.target.value) || 0)} style={{ ...ci, textAlign: "right" }} /></td>
                        <td style={tdS}><input type="number" value={row.mileageSubstandard || ""} onChange={e => updateRow(idx, "mileageSubstandard", parseFloat(e.target.value) || 0)} style={{ ...ci, textAlign: "right" }} /></td>
                        <td style={tdS}><input type="number" value={row.radius || ""} onChange={e => updateRow(idx, "radius", parseFloat(e.target.value) || 0)} style={{ ...ci, textAlign: "right" }} /></td>
                        <td style={tdS}><input type="number" step="0.01" value={row.conveyanceAmount || ""} onChange={e => updateRow(idx, "conveyanceAmount", parseFloat(e.target.value) || 0)} style={{ ...ci, textAlign: "right" }} /></td>
                        <td style={{ ...tdS, textAlign: "center" }}>
                          {rows.length > 1 && <button type="button" onClick={() => removeRow(idx)} style={{ background: "#fef2f2", border: "none", borderRadius: 4, color: "#dc2626", fontWeight: 700, fontSize: 14, width: 24, height: 24, cursor: "pointer" }}>×</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7} style={{ border: "1px solid #e2e8f0", padding: "7px 12px", textAlign: "right", fontWeight: 700, fontSize: 12, color: "#1d4ed8", background: "#eff6ff" }}>TOTAL MILEAGE</td>
                      <td style={{ ...tdS, background: "#eff6ff", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>{totalMileageStd.toFixed(2)}</td>
                      <td style={{ ...tdS, background: "#eff6ff", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>{totalMileageSub.toFixed(2)}</td>
                      <td style={{ ...tdS, background: "#eff6ff" }}></td>
                      <td style={{ ...tdS, background: "#eff6ff", textAlign: "right", fontWeight: 700, color: "#1d4ed8", fontFamily: "monospace" }}>GH¢ {totalConveyance.toFixed(2)}</td>
                      <td style={{ ...tdS, background: "#eff6ff" }}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <button type="button" onClick={addRow} style={{ marginTop: 12, border: "1.5px dashed #1d4ed8", color: "#1d4ed8", background: "transparent", fontSize: 12, fontWeight: 600, padding: "7px 18px", borderRadius: 6, cursor: "pointer" }}>
                + Add Row
              </button>
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: "transparent", color: "#1d4ed8", border: "1.5px solid #1d4ed8", borderRadius: 8, padding: "11px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                ← Back to Voucher
              </button>
              <button type="button" onClick={handleSave} disabled={saving} style={{ background: saving ? "#93c5fd" : "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(29,78,216,0.3)" }}>
                {saving ? "Saving…" : "Save & Print Both Pages →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
