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

/* Presentational icons — inline SVG, no new dependency required.
   Swap for lucide-react equivalents if that package is already installed. */
function IconCheck({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 10.5l3.5 3.5L15 6.5" />
    </svg>
  );
}

function IconArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function IconArrowLeft({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function IconWarning({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l6.28 11.18c.75 1.334-.213 2.987-1.743 2.987H3.72c-1.53 0-2.493-1.653-1.743-2.987l6.28-11.18zM10 7a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 7zm0 8a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* Shared Tailwind class strings (mirrors the previous inline style objects) */
const INPUT_CLS =
  "w-full rounded-md border border-slate-300 bg-white px-2.5 py-2.5 text-[13px] text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10";
const LABEL_CLS = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-600";
const SECTION_CLS = "mb-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7";
const SECTION_TITLE_CLS = "mb-4 border-b-2 border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wider text-blue-900";
const READONLY_CLS = "rounded-md border border-slate-300 bg-slate-50 px-2.5 py-2.5 font-mono text-[13px] font-semibold text-slate-900";
const TH_GROUP_CLS = "border border-blue-800 bg-blue-900 px-2 py-2.5 text-center text-[11px] font-bold text-white";
const TH_SUB_CLS = "border border-blue-800 bg-blue-800 px-1.5 py-1.5 text-center text-[10px] font-medium text-white";
const TD_CLS = "border border-slate-200 p-1 align-middle";
const CELL_INPUT_CLS =
  "w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-900 outline-none transition-colors duration-150 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10";
const CELL_INPUT_TRANSPARENT_CLS =
  "w-full rounded border border-slate-300 bg-transparent px-1.5 py-1 text-xs text-slate-900 outline-none transition-colors duration-150 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10";

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

  /* ── Success screen ── */
  if (savedId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[380px] rounded-xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
            <IconCheck className="h-7 w-7 text-blue-900" />
          </div>
          <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">Voucher Saved</h2>
          <p className="mb-7 text-sm leading-relaxed text-slate-600">
            Travel voucher and itinerary recorded successfully.
          </p>
          <button
            onClick={() => router.push(`/travel-voucher/${savedId}`)}
            className="mb-2.5 w-full rounded-lg bg-blue-900 py-[11px] text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
          >
            View &amp; Print (Both Pages)
          </button>
          <button
            onClick={() => { setSavedId(null); setStep(1); setRows([emptyRow(), emptyRow(), emptyRow()]); }}
            className="w-full rounded-lg border border-blue-900 bg-transparent py-2.5 text-sm font-semibold text-blue-900 transition-colors duration-150 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
          >
            Enter Another Voucher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Nav bar ── */}
      <div className="flex h-[60px] items-center gap-4 bg-blue-900 px-8">
        <img src="/logo.png" alt="GWL" className="h-9 w-9 rounded object-contain" />
        <div className="h-7 w-px bg-white/25" />
        <div>
          <div className="text-sm font-semibold leading-tight text-white">Ghana Water Limited</div>
          <div className="text-[11px] text-white/70">Ashanti South Region</div>
        </div>
        <div className="ml-auto rounded-full border border-white/30 bg-white/15 px-3.5 py-1 text-xs font-semibold text-white">
          Travel Expense Voucher
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-8 py-3.5">
        {[{ n: 1, label: "Voucher Details" }, { n: 2, label: "Itinerary" }].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            {i > 0 && (
              <div className={`h-0.5 w-10 ${step > i ? "bg-blue-900" : "bg-slate-200"}`} />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-xs font-bold ${
                  step >= s.n ? "bg-blue-900 text-white" : "bg-slate-100 text-blue-900"
                }`}
              >
                {step > s.n ? <IconCheck className="h-3.5 w-3.5" /> : s.n}
              </div>
              <span className={`text-[13px] ${step === s.n ? "font-bold text-blue-900" : "font-medium text-slate-400"}`}>
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[780px] px-6 py-8 pb-16">
        {/* ══════════════ STEP 1: VOUCHER ══════════════ */}
        {step === 1 && (
          <>
            <div className="mb-6">
              <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                New Travel Expense Voucher
              </h1>
              <p className="mt-1 text-[13px] text-slate-600">
                Complete the voucher details, then proceed to the itinerary.
              </p>
            </div>

            {/* Employee Details */}
            <div className={SECTION_CLS}>
              <div className={SECTION_TITLE_CLS}>① Employee Details</div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLS}>Employee Name</label>
                  <input {...register("employee", { required: true })} className={INPUT_CLS} placeholder="Full name" />
                  {errors.employee && <span className="text-[11px] text-red-600">Required</span>}
                </div>
                <div>
                  <label className={LABEL_CLS}>Post / Title</label>
                  <input {...register("post")} className={INPUT_CLS} placeholder="e.g. Engineer" />
                </div>
                <div>
                  <label className={LABEL_CLS}>District</label>
                  <input {...register("district")} className={INPUT_CLS} placeholder="e.g. Obuasi" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Activity</label>
                  <input {...register("activity")} className={INPUT_CLS} placeholder="Activity description" />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL_CLS}>Purpose of Travel</label>
                  <input {...register("purpose")} className={INPUT_CLS} placeholder="State the purpose clearly" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Allowance for the Month</label>
                  <input {...register("allowanceMonth")} className={INPUT_CLS} placeholder="e.g. June 2026" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Date</label>
                  <input type="date" {...register("date")} className={INPUT_CLS} />
                </div>
              </div>
            </div>

            {/* Lodging */}
            <div className={SECTION_CLS}>
              <div className={SECTION_TITLE_CLS}>② Hotel / Guest House Lodging</div>
              <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
                <div>
                  <label className={LABEL_CLS}>Number of Nights</label>
                  <input type="number" min={0} {...register("hotelNights")} className={INPUT_CLS} placeholder="0" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Rate per Night (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("hotelPerNight")} className={INPUT_CLS} placeholder="0.00" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Lodging Actual (auto)</label>
                  <div className={`${READONLY_CLS} tabular-nums`}>GH¢ {hotelActual.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Direct Travel Costs */}
            <div className={SECTION_CLS}>
              <div className={SECTION_TITLE_CLS}>③ Direct Travel Costs</div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLS}>By Air (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("byAir")} className={INPUT_CLS} placeholder="0.00" />
                </div>
                <div>
                  <label className={LABEL_CLS}>By Rail (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("byRail")} className={INPUT_CLS} placeholder="0.00" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Private Vehicle — Miles</label>
                  <input type="number" min={0} {...register("privateVehicleMiles")} className={INPUT_CLS} placeholder="0" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Rate per Mile (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("privateVehicleRate")} className={INPUT_CLS} placeholder="0.00" />
                </div>
                {vehicleTotal > 0 && (
                  <div className="sm:col-span-2">
                    <div className="rounded-md bg-slate-50 px-3 py-2 text-xs font-semibold text-blue-900">
                      Vehicle subtotal: <span className="font-mono tabular-nums">GH¢ {vehicleTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className={LABEL_CLS}>Tolls etc. (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("tolls")} className={INPUT_CLS} placeholder="0.00" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Miscellaneous (GH¢)</label>
                  <input type="number" step="0.01" min={0} {...register("miscellaneous")} className={INPUT_CLS} placeholder="0.00" />
                </div>
              </div>
            </div>

            {/* Account & Total */}
            <div className={SECTION_CLS}>
              <div className={SECTION_TITLE_CLS}>④ Account Code &amp; Total</div>
              <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLS}>Account Code</label>
                  <input {...register("accountCode")} className={INPUT_CLS} placeholder="Account / code" />
                </div>
                <div>
                  <label className={LABEL_CLS}>Total Amount (auto)</label>
                  <div className="rounded-lg border-2 border-blue-900 bg-slate-50 px-3.5 py-2.5 font-mono text-base font-bold tabular-nums text-blue-900">
                    GH¢ {total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={goToStep2}
                className="flex items-center gap-2 rounded-lg bg-blue-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
              >
                Next: Itinerary
                <IconArrowRight />
              </button>
            </div>
          </>
        )}

        {/* ══════════════ STEP 2: ITINERARY ══════════════ */}
        {step === 2 && (
          <>
            <div className="mb-6">
              <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Itinerary</h1>
              <p className="mt-1 text-[13px] text-slate-600">
                Enter each leg of the journey. This will print as page 2 of the voucher.
              </p>
            </div>

            <div className={SECTION_CLS}>
              <div className="mb-4 flex flex-col gap-3 border-b-2 border-slate-100 pb-2.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                  Journey Entries
                </span>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <div className="h-3.5 w-3.5 rounded-sm border border-slate-300 bg-slate-50" /> Departure
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <div className="h-3.5 w-3.5 rounded-sm border border-slate-300 bg-slate-100" /> Arrival
                  </div>
                </div>
                <span className="w-fit rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                  {rows.length} row{rows.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className={`${TH_GROUP_CLS} w-7`}>#</th>
                      <th className={TH_GROUP_CLS} colSpan={3}>Departure From</th>
                      <th className={TH_GROUP_CLS} colSpan={3}>Arrival At</th>
                      <th className={TH_GROUP_CLS} colSpan={2}>Mileage</th>
                      <th className={TH_GROUP_CLS}>Radius</th>
                      <th className={TH_GROUP_CLS}>Means of Conveyance (GH¢)</th>
                      <th className={`${TH_GROUP_CLS} w-9`}></th>
                    </tr>
                    <tr>
                      <th className={TH_SUB_CLS}></th>
                      <th className={TH_SUB_CLS}>Place</th>
                      <th className={TH_SUB_CLS}>Date</th>
                      <th className={TH_SUB_CLS}>Hour</th>
                      <th className={TH_SUB_CLS}>Place</th>
                      <th className={TH_SUB_CLS}>Date</th>
                      <th className={TH_SUB_CLS}>Hour</th>
                      <th className={TH_SUB_CLS}>Standard</th>
                      <th className={TH_SUB_CLS}>Sub-standard</th>
                      <th className={TH_SUB_CLS}></th>
                      <th className={TH_SUB_CLS}></th>
                      <th className={TH_SUB_CLS}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className={`${TD_CLS} text-center text-[11px] font-semibold text-slate-400`}>{idx + 1}</td>
                        <td className={`${TD_CLS} bg-slate-50`}>
                          <input value={row.depPlace} onChange={e => updateRow(idx, "depPlace", e.target.value)} className={CELL_INPUT_CLS} placeholder="e.g. Kumasi" />
                        </td>
                        <td className={`${TD_CLS} bg-slate-50`}>
                          <input type="date" value={row.depDate} onChange={e => updateRow(idx, "depDate", e.target.value)} className={CELL_INPUT_CLS} />
                        </td>
                        <td className={`${TD_CLS} bg-slate-50`}>
                          <input type="time" value={row.depHour} onChange={e => updateRow(idx, "depHour", e.target.value)} className={CELL_INPUT_CLS} />
                        </td>
                        <td className={`${TD_CLS} bg-slate-100`}>
                          <input value={row.arrPlace} onChange={e => updateRow(idx, "arrPlace", e.target.value)} className={CELL_INPUT_TRANSPARENT_CLS} placeholder="e.g. Obuasi" />
                        </td>
                        <td className={`${TD_CLS} bg-slate-100`}>
                          <input type="date" value={row.arrDate} onChange={e => updateRow(idx, "arrDate", e.target.value)} className={CELL_INPUT_TRANSPARENT_CLS} />
                        </td>
                        <td className={`${TD_CLS} bg-slate-100`}>
                          <input type="time" value={row.arrHour} onChange={e => updateRow(idx, "arrHour", e.target.value)} className={CELL_INPUT_TRANSPARENT_CLS} />
                        </td>
                        <td className={TD_CLS}>
                          <input type="number" value={row.mileageStandard || ""} onChange={e => updateRow(idx, "mileageStandard", parseFloat(e.target.value) || 0)} className={`${CELL_INPUT_CLS} text-right`} placeholder="0" />
                        </td>
                        <td className={TD_CLS}>
                          <input type="number" value={row.mileageSubstandard || ""} onChange={e => updateRow(idx, "mileageSubstandard", parseFloat(e.target.value) || 0)} className={`${CELL_INPUT_CLS} text-right`} placeholder="0" />
                        </td>
                        <td className={TD_CLS}>
                          <input type="number" value={row.radius || ""} onChange={e => updateRow(idx, "radius", parseFloat(e.target.value) || 0)} className={`${CELL_INPUT_CLS} text-right`} placeholder="0" />
                        </td>
                        <td className={TD_CLS}>
                          <input type="number" step="0.01" value={row.conveyanceAmount || ""} onChange={e => updateRow(idx, "conveyanceAmount", parseFloat(e.target.value) || 0)} className={`${CELL_INPUT_CLS} text-right`} placeholder="0.00" />
                        </td>
                        <td className={`${TD_CLS} text-center`}>
                          {rows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow(idx)}
                              className="flex h-6 w-6 items-center justify-center rounded bg-red-50 text-sm font-bold leading-none text-red-600 transition-colors duration-150 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-blue-900"
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7} className="border border-slate-200 bg-slate-50 px-3 py-2 text-right text-xs font-bold tracking-wide text-blue-900">
                        TOTAL MILEAGE
                      </td>
                      <td className="border border-slate-200 bg-slate-50 p-1 text-right font-mono font-bold tabular-nums text-slate-900">{totalMileageStandard.toFixed(2)}</td>
                      <td className="border border-slate-200 bg-slate-50 p-1 text-right font-mono font-bold tabular-nums text-slate-900">{totalMileageSubstandard.toFixed(2)}</td>
                      <td className="border border-slate-200 bg-slate-50 p-1"></td>
                      <td className="border border-slate-200 bg-slate-50 p-1 text-right font-mono font-bold tabular-nums text-blue-900">GH¢ {totalConveyance.toFixed(2)}</td>
                      <td className="border border-slate-200 bg-slate-50 p-1"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <button
                type="button"
                onClick={addRow}
                className="mt-3.5 rounded-md border border-dashed border-blue-900 bg-transparent px-4.5 py-[7px] text-xs font-semibold text-blue-900 transition-colors duration-150 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                + Add Row
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-600"
              >
                <IconWarning className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-lg border border-blue-900 bg-transparent px-6 py-2.5 text-sm font-semibold text-blue-900 transition-colors duration-150 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
              >
                <IconArrowLeft />
                Back to Voucher
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blue-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {saving ? "Saving…" : (
                  <>
                    Save &amp; Print Both Pages
                    <IconArrowRight />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}