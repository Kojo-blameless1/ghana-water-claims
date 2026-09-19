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
  overtimeCategory: "A" | "C" | "";  // radio selection
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
  overtimeCategory: "",
  overtimeHrs: 0,
  overtimeApproved: 0,
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

const INPUT_CLS =
  "w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-[13px] text-slate-900 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10";
const NUM_CLS =
  "w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-right text-xs text-slate-900 outline-none transition-colors duration-150 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10";
const NUM_CLS_TRANSPARENT =
  "w-full rounded-md border border-slate-300 bg-transparent px-2 py-1.5 text-right text-xs text-slate-900 outline-none transition-colors duration-150 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10";
const TH_CLS =
  "border border-blue-800 bg-blue-900 px-1.5 py-2 text-center text-[11px] font-bold whitespace-nowrap text-white";
const SUB_TH_CLS =
  "border border-blue-800 bg-blue-800 px-1 py-1.5 text-center text-[10px] font-medium whitespace-nowrap text-white";
const TD_CLS = "border border-slate-200 p-1 align-middle";
const TD_APPROVED_CLS = "border border-slate-200 bg-slate-50 p-1 align-middle";
const LABEL_CLS = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-600";
const SECTION_CLS = "mb-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7";
const SECTION_TITLE_CLS =
  "mb-4 border-b-2 border-slate-100 pb-2.5 text-[11px] font-bold uppercase tracking-wider text-blue-900";

export default function NewSummaryClaim() {
  const router = useRouter();
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [district, setDistrict] = useState("");
  const [month, setMonth] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [staffRows, setStaffRows] = useState<StaffRow[]>([
    emptyRow(), emptyRow(), emptyRow(),
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[380px] rounded-xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
            <IconCheck className="h-7 w-7 text-blue-900" />
          </div>
          <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">Summary Saved</h2>
          <p className="mb-7 text-sm leading-relaxed text-slate-600">
            The summary of claims has been recorded successfully.
          </p>
          <button
            onClick={() => router.push(`/summary-claims/${savedId}`)}
            className="mb-2.5 w-full rounded-lg bg-blue-900 py-[11px] text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
          >
            View &amp; Print Summary
          </button>
          <button
            onClick={() => setSavedId(null)}
            className="w-full rounded-lg border border-blue-900 bg-transparent py-2.5 text-sm font-semibold text-blue-900 transition-colors duration-150 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
          >
            Enter Another Summary
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
          Summary of Claims
        </div>
      </div>

      <div className="mx-auto max-w-[1300px] px-6 py-8 pb-16">
        <div className="mb-6">
          <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
            New Summary of Claims
          </h1>
          <p className="mt-1 text-[13px] text-slate-600">
            Fill in the claim details and staff entries below, then save to generate the printable summary.
          </p>
        </div>

        {/* ── Claim Details ── */}
        <div className={SECTION_CLS}>
          <div className={SECTION_TITLE_CLS}>① Claim Details</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={LABEL_CLS}>District</label>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={INPUT_CLS}
                placeholder="e.g. Obuasi"
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Month</label>
              <input
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={INPUT_CLS}
                placeholder="e.g. June 2026"
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Prepared By</label>
              <input
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                className={INPUT_CLS}
                placeholder="Name of preparer"
              />
            </div>
          </div>
        </div>

        {/* ── Staff Entries ── */}
        <div className={SECTION_CLS}>
          <div className="mb-4 flex items-center justify-between border-b-2 border-slate-100 pb-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
              ② Staff Entries
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
              {staffRows.length} row{staffRows.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Legend */}
          <div className="mb-3 flex gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <div className="h-3.5 w-3.5 rounded-sm border border-slate-300 bg-white" /> Proposed value
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <div className="h-3.5 w-3.5 rounded-sm border border-slate-300 bg-slate-50" /> Approved by RCM
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className={`${TH_CLS} w-[60px]`} rowSpan={2}>Staff No.</th>
                  <th className={`${TH_CLS} w-[140px]`} rowSpan={2}>Name of Staff</th>
                  <th className={TH_CLS} colSpan={2}>T &amp; T (GH¢)</th>
                  <th className={TH_CLS} colSpan={2}>Night Allowance (GH¢)</th>
                  <th className={TH_CLS} colSpan={2}>Day Trip Allowance (GH¢)</th>
                  <th className={TH_CLS} colSpan={2}>Risk Allowance (GH¢)</th>
                  <th className={TH_CLS} colSpan={3}>Overtime</th>
                  <th className={`${TH_CLS} w-9`} rowSpan={2}></th>
                </tr>
                <tr>
                  {["Proposed", "Approved (RCM)", "Proposed", "Approved (RCM)", "Proposed", "Approved (RCM)", "Proposed", "Approved (RCM)"].map((label, i) => (
                    <th key={i} className={SUB_TH_CLS}>{label}</th>
                  ))}
                  <th className={`${SUB_TH_CLS} w-20`}>Category</th>
                  <th className={`${SUB_TH_CLS} w-[60px]`}>Hrs</th>
                  <th className={`${SUB_TH_CLS} w-[90px]`}>Approved (GH¢)</th>
                </tr>
              </thead>
              <tbody>
                {staffRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className={TD_CLS}>
                      <input
                        value={row.staffNo}
                        onChange={(e) => updateRow(i, "staffNo", e.target.value)}
                        className={`${NUM_CLS} text-left`}
                        placeholder="No."
                      />
                    </td>
                    <td className={TD_CLS}>
                      <input
                        value={row.name}
                        onChange={(e) => updateRow(i, "name", e.target.value)}
                        className={`${NUM_CLS} text-left`}
                        placeholder="Full name"
                      />
                    </td>
                    {/* T&T */}
                    <td className={TD_CLS}>
                      <input type="number" value={row.tntProposed || ""} onChange={(e) => updateRow(i, "tntProposed", parseFloat(e.target.value) || 0)} className={NUM_CLS} />
                    </td>
                    <td className={TD_APPROVED_CLS}>
                      <input type="number" value={row.tntApproved || ""} onChange={(e) => updateRow(i, "tntApproved", parseFloat(e.target.value) || 0)} className={NUM_CLS_TRANSPARENT} />
                    </td>
                    {/* Night */}
                    <td className={TD_CLS}>
                      <input type="number" value={row.nightProposed || ""} onChange={(e) => updateRow(i, "nightProposed", parseFloat(e.target.value) || 0)} className={NUM_CLS} />
                    </td>
                    <td className={TD_APPROVED_CLS}>
                      <input type="number" value={row.nightApproved || ""} onChange={(e) => updateRow(i, "nightApproved", parseFloat(e.target.value) || 0)} className={NUM_CLS_TRANSPARENT} />
                    </td>
                    {/* Day Trip */}
                    <td className={TD_CLS}>
                      <input type="number" value={row.dayTripProposed || ""} onChange={(e) => updateRow(i, "dayTripProposed", parseFloat(e.target.value) || 0)} className={NUM_CLS} />
                    </td>
                    <td className={TD_APPROVED_CLS}>
                      <input type="number" value={row.dayTripApproved || ""} onChange={(e) => updateRow(i, "dayTripApproved", parseFloat(e.target.value) || 0)} className={NUM_CLS_TRANSPARENT} />
                    </td>
                    {/* Risk */}
                    <td className={TD_CLS}>
                      <input type="number" value={row.riskProposed || ""} onChange={(e) => updateRow(i, "riskProposed", parseFloat(e.target.value) || 0)} className={NUM_CLS} />
                    </td>
                    <td className={TD_APPROVED_CLS}>
                      <input type="number" value={row.riskApproved || ""} onChange={(e) => updateRow(i, "riskApproved", parseFloat(e.target.value) || 0)} className={NUM_CLS_TRANSPARENT} />
                    </td>

                    {/* ── Overtime Category — radio A / C ── */}
                    <td className={`${TD_CLS} min-w-[80px] text-center`}>
                      <div className="flex items-center justify-center gap-2.5">
                        <label
                          className={`flex cursor-pointer items-center gap-1 text-[11px] ${
                            row.overtimeCategory === "A" ? "font-bold text-blue-900" : "font-normal text-slate-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`cat-${i}`}
                            value="A"
                            checked={row.overtimeCategory === "A"}
                            onChange={() => updateRow(i, "overtimeCategory", "A")}
                            className="cursor-pointer accent-blue-900"
                          />
                          A
                        </label>
                        <label
                          className={`flex cursor-pointer items-center gap-1 text-[11px] ${
                            row.overtimeCategory === "C" ? "font-bold text-blue-900" : "font-normal text-slate-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`cat-${i}`}
                            value="C"
                            checked={row.overtimeCategory === "C"}
                            onChange={() => updateRow(i, "overtimeCategory", "C")}
                            className="cursor-pointer accent-blue-900"
                          />
                          C
                        </label>
                      </div>
                      {/* Show selected badge */}
                      {row.overtimeCategory && (
                        <div className="mt-1 inline-block rounded bg-amber-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          Cat {row.overtimeCategory}
                        </div>
                      )}
                    </td>

                    {/* Hrs */}
                    <td className={TD_CLS}>
                      <input type="number" value={row.overtimeHrs || ""} onChange={(e) => updateRow(i, "overtimeHrs", parseFloat(e.target.value) || 0)} className={NUM_CLS} />
                    </td>
                    {/* Approved */}
                    <td className={TD_APPROVED_CLS}>
                      <input type="number" value={row.overtimeApproved || ""} onChange={(e) => updateRow(i, "overtimeApproved", parseFloat(e.target.value) || 0)} className={NUM_CLS_TRANSPARENT} />
                    </td>

                    {/* Remove */}
                    <td className={`${TD_CLS} text-center`}>
                      {staffRows.length > 1 && (
                        <button
                          onClick={() => removeRow(i)}
                          title="Remove row"
                          className="flex h-6 w-6 items-center justify-center rounded bg-red-50 text-sm font-bold leading-none text-red-600 transition-colors duration-150 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-blue-900"
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
            className="mt-3.5 flex items-center gap-1.5 rounded-md border border-dashed border-blue-900 bg-transparent px-4.5 py-[7px] text-xs font-semibold text-blue-900 transition-colors duration-150 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            + Add Staff Row
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

        <div className="flex flex-col-reverse items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-xs text-slate-400">
            Signature fields appear on the printed summary only.
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
          >
            Save &amp; Generate Summary
            <IconArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}