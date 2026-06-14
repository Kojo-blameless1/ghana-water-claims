'use client'
import { useState } from 'react'

export default function NewSummaryClaim() {
  // Simple state: just an array of staff names (for testing)
  const [staffNames, setStaffNames] = useState(['Staff 1', 'Staff 2', 'Staff 3', 'Staff 4', 'Staff 5'])

  const addStaff = () => {
    alert('Add Staff clicked')
    setStaffNames([...staffNames, `Staff ${staffNames.length + 1}`])
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">GHANA WATER LIMITED – ASHANTI SOUTH</h1>
      <h2 className="text-xl">SUMMARY OF CLAIMS (TEST)</h2>
      
      <div className="my-4">
        <p><strong>District:</strong> <input className="border p-1" /></p>
        <p><strong>Month:</strong> <input className="border p-1" /></p>
      </div>

      <table className="border-collapse border border-black w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Staff No.</th>
            <th className="border p-2">Name</th>
           </tr>
        </thead>
        <tbody>
          {staffNames.map((name, idx) => (
            <tr key={idx}>
              <td className="border p-1">{idx + 1}</td>
              <td className="border p-1">{name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4 mt-4">
        <button onClick={addStaff} className="bg-gray-500 text-white px-4 py-2 rounded">
          + Add Staff
        </button>
        <button 
          onClick={() => alert('Save would happen here')} 
          className="bg-green-700 text-white px-6 py-2 rounded"
        >
          Save Summary
        </button>
      </div>
    </div>
  )
}