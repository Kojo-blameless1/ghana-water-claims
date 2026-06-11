'use client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type FormValues = {
  employee: string
  post: string
  district: string
  activity: string
  purpose: string
  allowanceMonth: string
  hotelNights: number
  hotelPerNight: number
  byAir: number
  byRail: number
  privateVehicleMiles: number
  privateVehicleRate: number
  tolls: number
  miscellaneous: number
  accountCode: string
  date: string
}

export default function NewTravelVoucher() {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormValues>()
  const router = useRouter()
  const [savedId, setSavedId] = useState<number | null>(null)

  // Calculations
  const hotelActual = (watch('hotelNights') || 0) * (watch('hotelPerNight') || 0)
  const vehicleTotal = (watch('privateVehicleMiles') || 0) * (watch('privateVehicleRate') || 0)
  const total = hotelActual + (watch('byAir') || 0) + (watch('byRail') || 0) +
                vehicleTotal + (watch('tolls') || 0) + (watch('miscellaneous') || 0)

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/travel-voucher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        hotelActual,
        totalAmount: total,
      }),
    })
    const { id } = await res.json()
    setSavedId(id)
  }

  if (savedId) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-700 mb-4">Voucher saved successfully!</p>
        <button onClick={() => router.push(`/travel-voucher/${savedId}`)} className="bg-blue-600 text-white px-4 py-2 rounded">
          View & Print
        </button>
        <button onClick={() => setSavedId(null)} className="ml-2 border px-4 py-2 rounded">Enter Another</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 border-2 border-gray-800 my-8 bg-white font-mono">
      {/* Header with logo */}
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Ghana Water Logo" className="mx-auto mb-2 h-16" />
        <h1 className="text-2xl font-bold text-black">GHANA WATER LIMITED</h1>
        <h2 className="text-xl text-black">ASHANTI SOUTH REGION</h2>
        <h3 className="text-xl underline text-black">TRAVEL EXPENSE VOUCHER</h3>
        <div className="flex justify-between mt-2 px-4">
          <span className="font-bold text-black">Original</span>
          <span className="font-bold text-black">Duplicate</span>
        </div>
      </div>

      {/* Employee details – fillable inputs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div><label className="font-bold text-black">EMPLOYEE:</label> <input {...register('employee')} className="border border-black ml-2 px-1 w-48" /></div>
        <div><label className="font-bold text-black">POST:</label> <input {...register('post')} className="border border-black ml-2 px-1 w-48" /></div>
        <div><label className="font-bold text-black">DISTRICT:</label> <input {...register('district')} className="border border-black ml-2 px-1 w-48" /></div>
        <div><label className="font-bold text-black">ACTIVITY:</label> <input {...register('activity')} className="border border-black ml-2 px-1 w-48" /></div>
        <div className="col-span-2"><label className="font-bold text-black">PURPOSE OF TRAVEL:</label> <input {...register('purpose')} className="border border-black ml-2 px-1 w-96" /></div>
        <div className="col-span-2"><label className="font-bold text-black">ALLOWANCE FOR THE MONTH:</label> <input {...register('allowanceMonth')} className="border border-black ml-2 px-1 w-48" /></div>
      </div>

      {/* Hotel table */}
      <table className="w-full border-collapse border border-black mb-4">
        <thead>
          <tr className="border border-black">
            <th className="border border-black p-2 text-black">Hotel/Guest House</th>
            <th className="border border-black p-2 text-black">Nights GH¢</th>
            <th className="border border-black p-2 text-black">per day Lodging</th>
            <th className="border border-black p-2 text-black">Actual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">Hotel/Guest House</td>
            <td className="border border-black p-2"><input type="number" {...register('hotelNights')} className="w-20 border border-black" /></td>
            <td className="border border-black p-2"><input type="number" step="0.01" {...register('hotelPerNight')} className="w-24 border border-black" /></td>
            <td className="border border-black p-2">{hotelActual.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Direct Travel Cost table */}
      <table className="w-full border-collapse border border-black mb-4">
        <thead>
          <tr>
            <th className="border border-black p-2 text-black">Direct Travel Cost</th>
            <th className="border border-black p-2 text-black">GH¢</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border border-black p-2">By Air</td><td className="border border-black p-2"><input type="number" step="0.01" {...register('byAir')} className="w-24 border border-black" /></td></tr>
          <tr><td className="border border-black p-2">By Rail</td><td className="border border-black p-2"><input type="number" step="0.01" {...register('byRail')} className="w-24 border border-black" /></td></tr>
          <tr>
            <td className="border border-black p-2">By Private Vehicle</td>
            <td className="border border-black p-2">
              <input type="number" {...register('privateVehicleMiles')} className="w-20 border border-black" /> miles at
              <input type="number" step="0.01" {...register('privateVehicleRate')} className="w-20 border border-black ml-1" /> per mile = {vehicleTotal.toFixed(2)}
            </td>
          </tr>
          <tr><td className="border border-black p-2">Toll, etc.</td><td className="border border-black p-2"><input type="number" step="0.01" {...register('tolls')} className="w-24 border border-black" /></td></tr>
          <tr><td className="border border-black p-2">Miscellaneous</td><td className="border border-black p-2"><input type="number" step="0.01" {...register('miscellaneous')} className="w-24 border border-black" /></td></tr>
        </tbody>
      </table>

      <div className="text-right font-bold text-xl mb-4">Total GH¢: {total.toFixed(2)}</div>

      {/* Account and Code */}
      <div className="flex gap-4 mb-4">
        <div><label className="font-bold text-black">Account:</label> <input {...register('accountCode')} className="border border-black ml-2 w-32" /></div>
        <div><label className="font-bold text-black">Code:</label> <input className="border border-black w-32" /></div>
      </div>

      {/* General Date */}
      <div className="mb-4">
        <label className="font-bold text-black">DATE:</label> <input {...register('date')} className="border border-black ml-2 w-40" placeholder="dd/mm/yyyy" />
        <span className="ml-2">20......</span>
      </div>

      {/* === SIGNATURE SECTION – blank dotted lines (no input fields) === */}
      <div className="mt-6 border-t border-black pt-4">
        <div className="flex items-center mb-2">
          <span className="font-bold w-32 text-black">CLAIMANT</span>
          <span className="border-b border-black flex-1 ml-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="font-bold w-32 text-black">D.D.O. / D.C.O.</span>
          <span className="border-b border-black flex-1 ml-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="font-bold w-32 text-black">DISTRICT/UNIT HEAD</span>
          <span className="border-b border-black flex-1 ml-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="font-bold w-32 text-black">SECTIONAL HEAD</span>
          <span className="border-b border-black flex-1 ml-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="font-bold w-32 text-black">REGIONAL CHIEF MANAGER</span>
          <span className="border-b border-black flex-1 ml-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="font-bold w-32 text-black">Approved</span>
          <span className="font-bold ml-2 text-black">DATE</span>
          <span className="border-b border-black w-28 ml-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="flex items-center flex-wrap mt-4">
          <span className="font-bold text-black">Received this</span>
          <span className="border-b border-black w-16 mx-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="font-bold text-black">day of</span>
          <span className="border-b border-black w-24 mx-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="font-bold mx-1 text-black">20</span>
          <span className="border-b border-black w-12 mx-1">&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="font-bold ml-2 text-black">in payment of the above account the sum of</span>
          <span className="border-b border-black flex-1 ml-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="flex items-center mt-4">
          <span className="font-bold text-black">Witness to Mark and Payments</span>
          <span className="border-b border-black flex-1 ml-4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="font-bold text-black">Signature of Receiver</span>
          <span className="border-b border-black flex-1 ml-4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm font-mono mt-6 pt-2 border-t border-black">
        G.W.L. ACCTS. FORMS 8
      </div>

      <div className="flex justify-end mt-6">
        <button type="submit" disabled={isSubmitting} className="bg-green-700 text-white px-6 py-2 rounded">
          {isSubmitting ? 'Saving...' : 'Save Voucher'}
        </button>
      </div>
     
    </form>
  )
}