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
  // Hotel
  hotelNights: number
  hotelPerNight: number
  // Direct Travel Costs
  byAir: number
  byRail: number
  privateVehicleMiles: number
  privateVehicleRate: number
  tolls: number
  miscellaneous: number
  // Account & date
  accountCode: string
  date: string
  // Signatures – just store as text
  claimant: string
  ddo: string
  districtHead: string
  sectionalHead: string
  regionalChief: string
  witness: string
  approvedDate: string
  receivedDate: string
  receivedSum: string
  receiverSignature: string
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
      {/* Header */}
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Ghana Water Logo" className="mx-auto mb-2 h-16" />
        <h1 className="text-2xl font-bold">GHANA WATER LIMITED</h1>
        <h2 className="text-xl">ASHANTI SOUTH REGION</h2>
        <h3 className="text-xl underline">TRAVEL EXPENSE VOUCHER</h3>
        <div className="flex justify-between mt-2">
            <span className="font-bold">Original</span>
            <span className="font-bold">Duplicate</span>
        </div>
      </div>

      {/* Employee details grid */}
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
            <th className="border border-black p-2">Hotel/Guest House</th>
            <th className="border border-black p-2">Nights GH¢</th>
            <th className="border border-black p-2">per day Lodging</th>
            <th className="border border-black p-2">Actual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">Hotel/Guest House</td>
            <td className="border border-black p-2"><input type="number" {...register('hotelNights')} className="w-20 border" /></td>
            <td className="border border-black p-2"><input type="number" step="0.01" {...register('hotelPerNight')} className="w-24 border" /></td>
            <td className="border border-black p-2">{hotelActual.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Direct Travel Cost table */}
      <table className="w-full border-collapse border border-black mb-4">
        <thead>
          <tr>
            <th className="border border-black p-2">Direct Travel Cost</th>
            <th className="border border-black p-2">GH¢</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border border-black p-2">By Air</td><td className="border border-black p-2"><input type="number" step="0.01" {...register('byAir')} className="w-24 border" /></td></tr>
          <tr><td className="border border-black p-2">By Rail</td><td className="border border-black p-2"><input type="number" step="0.01" {...register('byRail')} className="w-24 border" /></td></tr>
          <tr>
            <td className="border border-black p-2">By Private Vehicle</td>
            <td className="border border-black p-2">
              <input type="number" {...register('privateVehicleMiles')} className="w-20 border" /> miles at 
              <input type="number" step="0.01" {...register('privateVehicleRate')} className="w-20 border ml-1" /> per mile = {vehicleTotal.toFixed(2)}
            </td>
          </tr>
          <tr><td className="border border-black p-2">Toll, etc.</td><td className="border border-black p-2"><input type="number" step="0.01" {...register('tolls')} className="w-24 border" /></td></tr>
          <tr><td className="border border-black p-2">Miscellaneous</td><td className="border border-black p-2"><input type="number" step="0.01" {...register('miscellaneous')} className="w-24 border" /></td></tr>
        </tbody>
      </table>

      {/* Total */}
      <div className="text-right font-bold text-xl mb-4">Total GH¢: {total.toFixed(2)}</div>

      {/* Account and Code */}
      <div className="flex gap-4 mb-4">
        <div><label className="font-bold">Account:</label> <input {...register('accountCode')} className="border-b ml-2 w-32" /></div>
        <div><label className="font-bold">Code:</label> <input className="border-b w-32" /></div>
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="font-bold">DATE:</label> <input type="text" {...register('date')} className="border-b ml-2 w-40" placeholder="dd/mm/yyyy" />
        <span className="ml-2">20......</span>
      </div>

      {/* Signatures section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div><label className="font-bold">CLAIMANT:</label> <input {...register('claimant')} className="border-b ml-2 w-40" /></div>
        <div><label className="font-bold">D.D.O. / D.C.O.:</label> <input {...register('ddo')} className="border-b ml-2 w-40" /></div>
        <div><label className="font-bold">DISTRICT/UNIT HEAD:</label> <input {...register('districtHead')} className="border-b ml-2 w-40" /></div>
        <div><label className="font-bold">SECTIONAL HEAD:</label> <input {...register('sectionalHead')} className="border-b ml-2 w-40" /></div>
        <div className="col-span-2"><label className="font-bold">REGIONAL CHIEF MANAGER:</label> <input {...register('regionalChief')} className="border-b ml-2 w-64" /></div>
        <div className="col-span-2"><label className="font-bold">Witness to Mark and Payments:</label> <input {...register('witness')} className="border-b ml-2 w-64" /></div>
      </div>

      {/* Approved section */}
      <div className="mb-4">
        <div><label className="font-bold">Approved</label></div>
        <div><label className="font-bold">DATE:</label> <input {...register('approvedDate')} className="border-b ml-2 w-40" /></div>
      </div>

      {/* Received payment */}
      <div className="mb-4">
        <div>Received this <input {...register('receivedDate')} className="border-b w-24" /> day of <input className="border-b w-24" /> 20...... in payment of the above account the sum of <input {...register('receivedSum')} className="border-b w-40" /></div>
        <div className="mt-2"><label className="font-bold">Signature of Receiver:</label> <input {...register('receiverSignature')} className="border-b ml-2 w-64" /></div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-4">G.W.L. ACCTS. FORMS 8</div>

      <div className="flex justify-end mt-6">
        <button type="submit" disabled={isSubmitting} className="bg-green-700 text-white px-6 py-2 rounded">
          {isSubmitting ? 'Saving...' : 'Save Voucher'}
        </button>
      </div>
    </form>
  )
}