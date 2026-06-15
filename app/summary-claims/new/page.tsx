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
  overtimeCatC: number;
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
  overtimeCatC: 0,
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
  const updateRow = (
    i: number,
    field: keyof StaffRow,
    value: string | number,
  ) => {
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
        body: JSON.stringify({
          month,
          district,
          preparedBy,
          staffEntries: staffRows,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSavedId(data.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (savedId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm max-w-sm w-full">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Summary Saved
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            The summary of claims has been recorded.
          </p>
          <button
            onClick={() => router.push(`/summary-claims/${savedId}`)}
            className="w-full bg-[#006837] text-white py-2 rounded-lg font-semibold mb-3 hover:bg-[#004d28] transition"
          >
            View & Print Summary
          </button>
          <button
            onClick={() => setSavedId(null)}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Enter Another Summary
          </button>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837]";
  const numCls =
    "w-full border border-gray-200 rounded px-1.5 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#006837]";
  const labelCls =
    "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1";
  const thCls =
    "border border-gray-300 bg-[#006837] text-white text-xs font-semibold px-2 py-1.5 text-center";
  const subThCls =
    "border border-gray-300 bg-[#004d28] text-white text-xs px-2 py-1 text-center";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/logo.png"
            alt="GWL Logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-[#006837] leading-tight">
              Ghana Water Limited – Ashanti South
            </h1>
            <p className="text-sm text-gray-500">
              Summary of Claims — Data Entry
            </p>
          </div>
        </div>

        {/* Top fields */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#006837] mb-4 pb-2 border-b border-gray-100">
            Claim Details
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>District</label>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={inputCls}
                placeholder="e.g. Obuasi"
              />
            </div>
            <div>
              <label className={labelCls}>Month</label>
              <input
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={inputCls}
                placeholder="e.g. June 2026"
              />
            </div>
            <div>
              <label className={labelCls}>Prepared By</label>
              <input
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                className={inputCls}
                placeholder="Name of preparer"
              />
            </div>
          </div>
        </section>

        {/* Staff table */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-5 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#006837]">
              Staff Entries
            </h2>
            <span className="text-xs text-gray-400">
              {staffRows.length} row{staffRows.length !== 1 ? "s" : ""}
            </span>
          </div>

          <table className="w-full border-collapse text-xs min-w-[1100px]">
            <thead>
              <tr>
                <th className={thCls} rowSpan={2}>
                  Staff No.
                </th>
                <th className={thCls} rowSpan={2}>
                  Name of Staff
                </th>
                <th className={thCls} colSpan={2}>
                  T &amp; T (GH¢)
                </th>
                <th className={thCls} colSpan={2}>
                  Night Allowance (GH¢)
                </th>
                <th className={thCls} colSpan={2}>
                  Day Trip Allowance (GH¢)
                </th>
                <th className={thCls} colSpan={2}>
                  Risk Allowance (GH¢)
                </th>
                <th className={thCls} colSpan={4}>
                  Overtime
                </th>
                <th className={thCls} rowSpan={2}></th>
              </tr>
              <tr>
                <th className={subThCls}>Proposed</th>
                <th className={subThCls}>Approved (RCM)</th>
                <th className={subThCls}>Proposed</th>
                <th className={subThCls}>Approved (RCM)</th>
                <th className={subThCls}>Proposed</th>
                <th className={subThCls}>Approved (RCM)</th>
                <th className={subThCls}>Proposed</th>
                <th className={subThCls}>Approved (RCM)</th>
                <th className={subThCls}>Cat A</th>
                <th className={subThCls}>Cat C</th>
                <th className={subThCls}>Hrs</th>
                <th className={subThCls}>Approved (RCM)</th>
              </tr>
            </thead>
            <tbody>
              {staffRows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-200 p-1">
                    <input
                      value={row.staffNo}
                      onChange={(e) => updateRow(i, "staffNo", e.target.value)}
                      className={numCls + " text-left"}
                      placeholder="No."
                    />
                  </td>
                  <td className="border border-gray-200 p-1 min-w-[130px]">
                    <input
                      value={row.name}
                      onChange={(e) => updateRow(i, "name", e.target.value)}
                      className={numCls + " text-left"}
                      placeholder="Full name"
                    />
                  </td>
                  {/* T&T */}
                  <td className="border border-gray-200 p-1">
                    <input
                      type="number"
                      value={row.tntProposed || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "tntProposed",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  <td className="border border-gray-200 p-1 bg-yellow-50">
                    <input
                      type="number"
                      value={row.tntApproved || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "tntApproved",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  {/* Night */}
                  <td className="border border-gray-200 p-1">
                    <input
                      type="number"
                      value={row.nightProposed || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "nightProposed",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  <td className="border border-gray-200 p-1 bg-yellow-50">
                    <input
                      type="number"
                      value={row.nightApproved || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "nightApproved",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  {/* Day Trip */}
                  <td className="border border-gray-200 p-1">
                    <input
                      type="number"
                      value={row.dayTripProposed || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "dayTripProposed",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  <td className="border border-gray-200 p-1 bg-yellow-50">
                    <input
                      type="number"
                      value={row.dayTripApproved || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "dayTripApproved",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  {/* Risk */}
                  <td className="border border-gray-200 p-1">
                    <input
                      type="number"
                      value={row.riskProposed || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "riskProposed",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  <td className="border border-gray-200 p-1 bg-yellow-50">
                    <input
                      type="number"
                      value={row.riskApproved || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "riskApproved",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  {/* Overtime */}
                  <td className="border border-gray-200 p-1">
                    <input
                      type="number"
                      value={row.overtimeCatA || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "overtimeCatA",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  <td className="border border-gray-200 p-1">
                    <input
                      type="number"
                      value={row.overtimeCatC || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "overtimeCatC",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  <td className="border border-gray-200 p-1">
                    <input
                      type="number"
                      value={row.overtimeHrs || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "overtimeHrs",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  <td className="border border-gray-200 p-1 bg-yellow-50">
                    <input
                      type="number"
                      value={row.overtimeApproved || ""}
                      onChange={(e) =>
                        updateRow(
                          i,
                          "overtimeApproved",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className={numCls}
                    />
                  </td>
                  <td className="border border-gray-200 p-1 text-center">
                    {staffRows.length > 1 && (
                      <button
                        onClick={() => removeRow(i)}
                        className="text-red-400 hover:text-red-600 text-base font-bold"
                        title="Remove row"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs text-gray-400 mt-2 italic">
            💡 Yellow columns = "Approved by RCM" fields. White columns =
            proposed values.
          </p>

          <button
            type="button"
            onClick={addRow}
            className="mt-4 border border-dashed border-[#006837] text-[#006837] text-sm px-4 py-1.5 rounded hover:bg-[#006837]/5 transition"
          >
            + Add Staff Row
          </button>
        </section>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Signature fields appear on the printed summary only.
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#006837] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-[#004d28] transition"
          >
            Save & Print Summary →
          </button>
        </div>
      </div>
    </div>
  );
}
