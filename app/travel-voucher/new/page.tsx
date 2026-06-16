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

export default function NewTravelVoucher() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>();
  const router = useRouter();
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const n = (v: unknown) => (isNaN(Number(v)) ? 0 : Number(v));
  const hotelActual = n(watch("hotelNights")) * n(watch("hotelPerNight"));
  const vehicleTotal = n(watch("privateVehicleMiles")) * n(watch("privateVehicleRate"));
  const total =
    hotelActual +
    n(watch("byAir")) +
    n(watch("byRail")) +
    vehicleTotal +
    n(watch("tolls")) +
    n(watch("miscellaneous"));

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/travel-voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          hotelNights: n(data.hotelNights),
          hotelPerNight: n(data.hotelPerNight),
          byAir: n(data.byAir),
          byRail: n(data.byRail),
          privateVehicleMiles: n(data.privateVehicleMiles),
          privateVehicleRate: n(data.privateVehicleRate),
          tolls: n(data.tolls),
          miscellaneous: n(data.miscellaneous),
          hotelActual,
          totalAmount: total,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setSavedId(json.id);
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
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "48px 40px",
          textAlign: "center", boxShadow: "0 4px 24px rgba(0,82,204,0.10)",
          maxWidth: 380, width: "100%", border: "1px solid #dce7ff",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#e8f0ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", fontSize: 28, color: "#0052cc",
          }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a2540", marginBottom: 8 }}>
            Voucher Saved
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
            The travel expense voucher has been recorded successfully.
          </p>
          <button
            onClick={() => router.push(`/travel-voucher/${savedId}`)}
            style={{
              width: "100%", background: "#0052cc", color: "#fff", border: "none",
              borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14,
              cursor: "pointer", marginBottom: 10,
            }}
          >
            View &amp; Print Voucher
          </button>
          <button
            onClick={() => setSavedId(null)}
            style={{
              width: "100%", background: "transparent", color: "#0052cc",
              border: "1.5px solid #0052cc", borderRadius: 8, padding: "10px 0",
              fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            Enter Another Voucher
          </button>
        </div>
      </div>
    );
  }

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
    borderBottom: "2px solid #e8f0ff", margin: "0 0 16px 0",
  };
  const readonlyStyle: React.CSSProperties = {
    border: "1.5px solid #dce7ff", borderRadius: 6, padding: "9px 11px",
    fontSize: 13, background: "#f0f4ff", color: "#0a2540",
    fontFamily: "monospace", fontWeight: 600,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Nav bar ── */}
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
          marginLeft: "auto", background: "rgba(255,255,255,0.15)", color: "#fff",
          fontSize: 12, fontWeight: 600, padding: "4px 14px",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)",
        }}>
          Travel Expense Voucher
        </div>
      </div>

      {/* ── Page body ── */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Page heading */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0a2540", margin: 0 }}>
            New Travel Expense Voucher
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
            Complete all sections below. Totals are calculated automatically.
          </p>
        </div>

        {/* ── Section 1: Employee Details ── */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>① Employee Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Employee Name</label>
              <input {...register("employee", { required: true })} style={inputStyle} placeholder="Full name" />
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

        {/* ── Section 2: Lodging ── */}
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

        {/* ── Section 3: Direct Travel Costs ── */}
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
                <div style={{
                  background: "#e8f0ff", borderRadius: 6, padding: "8px 12px",
                  fontSize: 12, color: "#0052cc", fontWeight: 600,
                }}>
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

        {/* ── Section 4: Account & Total ── */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>④ Account Code &amp; Total</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "end" }}>
            <div>
              <label style={labelStyle}>Account Code</label>
              <input {...register("accountCode")} style={inputStyle} placeholder="Account / code" />
            </div>
            <div>
              <label style={labelStyle}>Total Amount (auto)</label>
              <div style={{
                border: "2px solid #0052cc", borderRadius: 8, padding: "10px 14px",
                background: "#e8f0ff", color: "#0052cc", fontSize: 16,
                fontWeight: 800, fontFamily: "monospace",
              }}>
                GH¢ {total.toFixed(2)}
              </div>
            </div>
          </div>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
            Signature fields appear on the printed voucher only.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: isSubmitting ? "#7aa7e0" : "#0052cc",
              color: "#fff", border: "none", borderRadius: 8,
              padding: "12px 32px", fontWeight: 700, fontSize: 14,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(0,82,204,0.35)",
            }}
          >
            {isSubmitting ? "Saving…" : "Save & Print Voucher →"}
          </button>
        </div>
      </form>
    </div>
  );
}