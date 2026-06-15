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
  const vehicleTotal =
    n(watch("privateVehicleMiles")) * n(watch("privateVehicleRate"));
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

  if (savedId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm max-w-sm w-full">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Voucher Saved
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            The travel expense voucher has been recorded successfully.
          </p>
          <button
            onClick={() => router.push(`/travel-voucher/${savedId}`)}
            className="w-full bg-[#006837] text-white py-2 rounded-lg font-semibold mb-3 hover:bg-[#004d28] transition"
          >
            View & Print Voucher
          </button>
          <button
            onClick={() => setSavedId(null)}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Enter Another Voucher
          </button>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837] focus:border-transparent";
  const labelCls =
    "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/logo.png"
            alt="GWL Logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-[#006837] leading-tight">
              Ghana Water Limited
            </h1>
            <p className="text-sm text-gray-500">
              Ashanti South Region — Travel Expense Voucher
            </p>
          </div>
        </div>

        {/* ── Section 1: Employee Details ── */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#006837] mb-4 pb-2 border-b border-gray-100">
            Employee Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Employee Name</label>
              <input
                {...register("employee", { required: true })}
                className={inputCls}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className={labelCls}>Post / Title</label>
              <input
                {...register("post")}
                className={inputCls}
                placeholder="e.g. Engineer"
              />
            </div>
            <div>
              <label className={labelCls}>District</label>
              <input
                {...register("district")}
                className={inputCls}
                placeholder="e.g. Obuasi"
              />
            </div>
            <div>
              <label className={labelCls}>Activity</label>
              <input
                {...register("activity")}
                className={inputCls}
                placeholder="Activity description"
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Purpose of Travel</label>
              <input
                {...register("purpose")}
                className={inputCls}
                placeholder="State the purpose clearly"
              />
            </div>
            <div>
              <label className={labelCls}>Allowance for the Month</label>
              <input
                {...register("allowanceMonth")}
                className={inputCls}
                placeholder="e.g. June 2026"
              />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input
                {...register("date")}
                className={inputCls}
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>
        </section>

        {/* ── Section 2: Lodging ── */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#006837] mb-4 pb-2 border-b border-gray-100">
            Hotel / Guest House Lodging
          </h2>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className={labelCls}>Number of Nights</label>
              <input
                type="number"
                min={0}
                {...register("hotelNights")}
                className={inputCls}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelCls}>Rate per Night (GH¢)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                {...register("hotelPerNight")}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelCls}>Lodging Actual (auto)</label>
              <div className="border border-gray-200 bg-gray-50 rounded px-2 py-1.5 text-sm font-mono text-gray-700">
                GH¢ {hotelActual.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Direct Travel Costs ── */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-5 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#006837] mb-4 pb-2 border-b border-gray-100">
            Direct Travel Costs
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>By Air (GH¢)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                {...register("byAir")}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelCls}>By Rail (GH¢)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                {...register("byRail")}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelCls}>Private Vehicle — Miles</label>
              <input
                type="number"
                min={0}
                {...register("privateVehicleMiles")}
                className={inputCls}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelCls}>Rate per Mile (GH¢)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                {...register("privateVehicleRate")}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
            {vehicleTotal > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500">
                  Vehicle subtotal:{" "}
                  <span className="font-mono font-semibold text-gray-700">
                    GH¢ {vehicleTotal.toFixed(2)}
                  </span>
                </p>
              </div>
            )}
            <div>
              <label className={labelCls}>Tolls etc. (GH¢)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                {...register("tolls")}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelCls}>Miscellaneous (GH¢)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                {...register("miscellaneous")}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
          </div>
        </section>

        {/* ── Section 4: Account & Total ── */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#006837] mb-4 pb-2 border-b border-gray-100">
            Account Code & Total
          </h2>
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelCls}>Account Code</label>
              <input
                {...register("accountCode")}
                className={inputCls}
                placeholder="Account / code"
              />
            </div>
            <div>
              <label className={labelCls}>Total Amount (auto)</label>
              <div className="border border-[#006837] bg-[#006837]/5 rounded px-3 py-2 text-base font-bold font-mono text-[#006837]">
                GH¢ {total.toFixed(2)}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Signature fields appear on the printed voucher only.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#006837] text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-[#004d28] transition disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save & Print Voucher →"}
          </button>
        </div>
      </form>
    </div>
  );
}
