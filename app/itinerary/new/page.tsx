'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ItineraryRow = {
  depPlace: string
  depDate: string
  depHour: string
  arrPlace: string
  arrDate: string
  arrHour: string
  mileageStandard: number
  mileageSubstandard: number
  radius: number
  conveyanceAmount: number
}

const emptyRow = (): ItineraryRow => ({
  depPlace: '', depDate: '', depHour: '',
  arrPlace: '', arrDate: '', arrHour: '',
  mileageStandard: 0, mileageSubstandard: 0,
  radius: 0, conveyanceAmount: 0
})

export default function NewItinerary() {
  const router = useRouter()
  const [savedId, setSavedId] = useState<number | null>(null)
  const [rows, setRows] = useState<ItineraryRow[]>([emptyRow()])

  const addRow = () => setRows([...rows, emptyRow()])
  const removeRow = (idx: number) => {
    if (rows.length === 1) return
    setRows(rows.filter((_, i) => i !== idx))
  }
  const updateRow = (idx: number, field: keyof ItineraryRow, value: string | number) => {
    const updated = [...rows]
    updated[idx] = { ...updated[idx], [field]: value }
    setRows(updated)
  }

  const totalConveyance = rows.reduce((sum, row) => sum + (row.conveyanceAmount || 0), 0)

  const handleSave = async () => {
    const payload = { entries: rows }
    const res = await fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (res.ok) setSavedId(data.id)
    else alert('Save failed: ' + (data.error || 'unknown'))
  }

  if (savedId) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-700 mb-4">Itinerary saved successfully!</p>
        <button onClick={() => router.push(`/itinerary/${savedId}`)} className="bg-blue-600 text-white px-4 py-2 rounded">
          View & Print
        </button>
        <button onClick={() => setSavedId(null)} className="ml-2 border px-4 py-2 rounded">Enter Another</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white my-8">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-2 h-16" />
        <h1 className="text-2xl font-bold">GHANA WATER LIMITED – ASHANTI SOUTH</h1>
        <h2 className="text-xl">ITINERARY</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th colSpan={3} className="border p-2">Departure From</th>
              <th colSpan={3} className="border p-2">Arrival at</th>
              <th colSpan={2} className="border p-2">Mileage</th>
              <th className="border p-2">Radius</th>
              <th className="border p-2">Means of Conveyance (GH¢)</th>
              <th className="border p-2">Action</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border p-2">Place</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Hour</th>
              <th className="border p-2">Place</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Hour</th>
              <th className="border p-2">Standard</th>
              <th className="border p-2">Sub‑standard</th>
              <th className="border p-2"></th>
              <th className="border p-2"></th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="border p-1">
                  <input value={row.depPlace} onChange={e => updateRow(idx, 'depPlace', e.target.value)} className="w-24 border" />
                </td>
                <td className="border p-1">
                  <input type="date" value={row.depDate} onChange={e => updateRow(idx, 'depDate', e.target.value)} className="w-28 border" />
                </td>
                <td className="border p-1">
                  <input value={row.depHour} onChange={e => updateRow(idx, 'depHour', e.target.value)} className="w-20 border" />
                </td>
                <td className="border p-1">
                  <input value={row.arrPlace} onChange={e => updateRow(idx, 'arrPlace', e.target.value)} className="w-24 border" />
                </td>
                <td className="border p-1">
                  <input type="date" value={row.arrDate} onChange={e => updateRow(idx, 'arrDate', e.target.value)} className="w-28 border" />
                </td>
                <td className="border p-1">
                  <input value={row.arrHour} onChange={e => updateRow(idx, 'arrHour', e.target.value)} className="w-20 border" />
                </td>
                <td className="border p-1">
                  <input type="number" value={row.mileageStandard} onChange={e => updateRow(idx, 'mileageStandard', parseFloat(e.target.value) || 0)} className="w-20 border" />
                </td>
                <td className="border p-1">
                  <input type="number" value={row.mileageSubstandard} onChange={e => updateRow(idx, 'mileageSubstandard', parseFloat(e.target.value) || 0)} className="w-20 border" />
                </td>
                <td className="border p-1">
                  <input type="number" value={row.radius} onChange={e => updateRow(idx, 'radius', parseFloat(e.target.value) || 0)} className="w-20 border" />
                </td>
                <td className="border p-1">
                  <input type="number" step="0.01" value={row.conveyanceAmount} onChange={e => updateRow(idx, 'conveyanceAmount', parseFloat(e.target.value) || 0)} className="w-24 border" />
                </td>
                <td className="border p-1 text-center">
                  {rows.length > 1 && (
                    <button type="button" onClick={() => removeRow(idx)} className="text-red-600">✖</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 font-bold">
        Total Mileage (GH¢): {totalConveyance.toFixed(2)}
      </div>

      <div className="flex justify-between mt-4">
        <button type="button" onClick={addRow} className="bg-gray-500 text-white px-4 py-2 rounded">
          + Add Row
        </button>
        <button type="button" onClick={handleSave} className="bg-green-700 text-white px-6 py-2 rounded">
          Save Itinerary
        </button>
      </div>
    </div>
  )
}