'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type StaffRow = {
  staffNo: string
  name: string
  tntProposed: number
  tntApproved: number
  nightProposed: number
  nightApproved: number
  dayTripProposed: number
  dayTripApproved: number
  riskApproved: number
  overtimeCatA: number
  overtimeCatC: number
  overtimeHrs: number
  overtimeApproved: number
}

const emptyRow = (): StaffRow => ({
  staffNo: '', name: '',
  tntProposed: 0, tntApproved: 0,
  nightProposed: 0, nightApproved: 0,
  dayTripProposed: 0, dayTripApproved: 0,
  riskApproved: 0,
  overtimeCatA: 0, overtimeCatC: 0, overtimeHrs: 0,
  overtimeApproved: 0
})

export default function NewSummaryClaim() {
  const router = useRouter()
  const [savedId, setSavedId] = useState<number | null>(null)
  const [district, setDistrict] = useState('')
  const [month, setMonth] = useState('')
  const [staffRows, setStaffRows] = useState<StaffRow[]>([
    emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()
  ])

  const addStaffRow = () => {
    console.log('Add staff clicked')
    setStaffRows(prev => [...prev, emptyRow()])
  }

  const removeStaffRow = (index: number) => {
    if (staffRows.length <= 1) return
    setStaffRows(prev => prev.filter((_, i) => i !== index))
  }

  const updateStaffRow = (index: number, field: keyof StaffRow, value: string | number) => {
    setStaffRows(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleSave = async () => {
    const payload = {
      month,
      district,
      staffEntries: staffRows
    }
    try {
      const res = await fetch('/api/summary-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        setSavedId(data.id)
      } else {
        alert('Save failed: ' + (data.error || 'unknown error'))
      }
    } catch (err: any) {
      alert('Network error: ' + err.message)
    }
  }

  if (savedId) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-700 mb-4">Summary saved successfully!</p>
        <button onClick={() => router.push(`/summary-claims/${savedId}`)} className="bg-blue-600 text-white px-4 py-2 rounded">
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
        <h2 className="text-xl">SUMMARY OF CLAIMS</h2>
      </div>

      {/* District left, Month right */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <label className="font-bold">DISTRICT:</label>
          <input value={district} onChange={(e) => setDistrict(e.target.value)} className="border border-black ml-2 p-1 w-64" />
        </div>
        <div className="w-1/2 text-right">
          <label className="font-bold">MONTH:</label>
          <input value={month} onChange={(e) => setMonth(e.target.value)} className="border border-black ml-2 p-1 w-48" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Staff No.</th>
              <th className="border p-2">Name of Staff</th>
              <th className="border p-2" colSpan={2}>T & T</th>
              <th className="border p-2" colSpan={2}>Night Allowance</th>
              <th className="border p-2" colSpan={2}>Day Trip Allowance</th>
              <th className="border p-2">Risk Allowance</th>
              <th className="border p-2" colSpan={3}>Overtime Hours</th>
              <th className="border p-2">Overtime Approved</th>
              <th className="border p-2"></th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border p-2"></th><th className="border p-2"></th>
              <th className="border p-2">Proposed</th><th className="border p-2">Approved by RCM</th>
              <th className="border p-2">Proposed</th><th className="border p-2">Approved by RCM</th>
              <th className="border p-2">Proposed</th><th className="border p-2">Approved by RCM</th>
              <th className="border p-2">Approved by RCM</th>
              <th className="border p-2">Cat A</th><th className="border p-2">Cat C</th><th className="border p-2">Overtime Hrs</th>
              <th className="border p-2">Approved by RCM</th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {staffRows.map((row, idx) => (
              <tr key={idx}>
                <td className="border p-1"><input value={row.staffNo} onChange={(e) => updateStaffRow(idx, 'staffNo', e.target.value)} className="w-20 border" /></td>
                <td className="border p-1"><input value={row.name} onChange={(e) => updateStaffRow(idx, 'name', e.target.value)} className="w-32 border" /></td>
                <td className="border p-1"><input type="number" value={row.tntProposed} onChange={(e) => updateStaffRow(idx, 'tntProposed', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1"><input type="number" value={row.tntApproved} onChange={(e) => updateStaffRow(idx, 'tntApproved', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1"><input type="number" value={row.nightProposed} onChange={(e) => updateStaffRow(idx, 'nightProposed', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1"><input type="number" value={row.nightApproved} onChange={(e) => updateStaffRow(idx, 'nightApproved', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1"><input type="number" value={row.dayTripProposed} onChange={(e) => updateStaffRow(idx, 'dayTripProposed', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1"><input type="number" value={row.dayTripApproved} onChange={(e) => updateStaffRow(idx, 'dayTripApproved', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1"><input type="number" value={row.riskApproved} onChange={(e) => updateStaffRow(idx, 'riskApproved', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1"><input type="number" value={row.overtimeCatA} onChange={(e) => updateStaffRow(idx, 'overtimeCatA', parseFloat(e.target.value) || 0)} className="w-16 border" /></td>
                <td className="border p-1"><input type="number" value={row.overtimeCatC} onChange={(e) => updateStaffRow(idx, 'overtimeCatC', parseFloat(e.target.value) || 0)} className="w-16 border" /></td>
                <td className="border p-1"><input type="number" value={row.overtimeHrs} onChange={(e) => updateStaffRow(idx, 'overtimeHrs', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1"><input type="number" value={row.overtimeApproved} onChange={(e) => updateStaffRow(idx, 'overtimeApproved', parseFloat(e.target.value) || 0)} className="w-20 border" /></td>
                <td className="border p-1 text-center">
                  {staffRows.length > 1 && (
                    <button type="button" onClick={() => removeStaffRow(idx)} className="text-red-600">✖</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button type="button" onClick={addStaffRow} className="bg-gray-500 text-white px-4 py-2 rounded">
          + Add Staff
        </button>
        <button type="button" onClick={handleSave} className="bg-green-700 text-white px-6 py-2 rounded">
          Save Summary
        </button>
      </div>
    </div>
  )
}