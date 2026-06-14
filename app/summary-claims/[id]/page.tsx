import prisma from '@/lib/prisma'
import PrintButton from '@/components/PrintButton'

export default async function ViewSummaryClaim({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const claim = await prisma.summaryClaim.findUnique({ where: { id } })

  if (!claim) {
    return <div className="p-8 text-center text-red-600">Summary not found</div>
  }

  const staffEntries = JSON.parse(claim.staffEntries)

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white my-8" id="print-area">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-2 h-16" />
        <h1 className="text-2xl font-bold">GHANA WATER LIMITED – ASHANTI SOUTH</h1>
        <h2 className="text-xl">SUMMARY OF CLAIMS</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div><span className="font-bold">MONTH:</span> {claim.month}</div>
        <div><span className="font-bold">DISTRICT:</span> {claim.district}</div>
        <div><span className="font-bold">PREPARED BY (DDO/DCO):</span> {claim.preparedBy}</div>
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
            </tr>
            <tr className="bg-gray-50">
              <th className="border p-2"></th><th className="border p-2"></th>
              <th className="border p-2">Proposed</th><th className="border p-2">Approved by RCM</th>
              <th className="border p-2">Proposed</th><th className="border p-2">Approved by RCM</th>
              <th className="border p-2">Proposed</th><th className="border p-2">Approved by RCM</th>
              <th className="border p-2">Approved by RCM</th>
              <th className="border p-2">Cat A</th><th className="border p-2">Cat C</th><th className="border p-2">Overtime Hrs</th>
              <th className="border p-2">Approved by RCM</th>
            </tr>
          </thead>
          <tbody>
            {staffEntries.map((row: any, idx: number) => (
              <tr key={idx}>
                <td className="border p-1">{row.staffNo}</td>
                <td className="border p-1">{row.name}</td>
                <td className="border p-1">{row.tntProposed}</td>
                <td className="border p-1">{row.tntApproved}</td>
                <td className="border p-1">{row.nightProposed}</td>
                <td className="border p-1">{row.nightApproved}</td>
                <td className="border p-1">{row.dayTripProposed}</td>
                <td className="border p-1">{row.dayTripApproved}</td>
                <td className="border p-1">{row.riskApproved}</td>
                <td className="border p-1">{row.overtimeCatA}</td>
                <td className="border p-1">{row.overtimeCatC}</td>
                <td className="border p-1">{row.overtimeHrs}</td>
                <td className="border p-1">{row.overtimeApproved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature & Approval section – blank for manual signing */}
      <div className="mt-8 border-t border-black pt-4">
        <div className="flex justify-between mb-2">
          <span className="font-bold">RECOMMENDED FOR APPROVAL:</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><span className="font-bold">DDO / DCO</span><span className="border-b border-black flex-1 ml-2 block mt-1">&nbsp;</span></div>
          <div><span className="font-bold">DISTRICT/UNIT HEAD</span><span className="border-b border-black flex-1 ml-2 block mt-1">&nbsp;</span></div>
          <div><span className="font-bold">SECTIONAL HEAD</span><span className="border-b border-black flex-1 ml-2 block mt-1">&nbsp;</span></div>
        </div>
        <div className="flex justify-between mt-4">
          <span className="font-bold">APPROVED BY:</span>
          <span className="font-bold ml-4">REGIONAL CHIEF MANAGER</span>
          <span className="border-b border-black w-48 ml-2">&nbsp;</span>
        </div>
      </div>

      <div className="text-center text-sm mt-6 pt-2 border-t border-black">
        G.W.L. ACCTS. FORMS 8
      </div>

      <div className="no-print flex justify-center mt-6">
        <PrintButton targetId="print-area" />
      </div>
    </div>
  )
}