import prisma from '@/lib/prisma'
import PrintButton from '@/components/PrintButton'

export default async function ViewVoucher({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const voucher = await prisma.travelVoucher.findUnique({ where: { id } })
  if (!voucher) return <div>Voucher not found</div>

  const hotelActual = (voucher.hotelNights || 0) * (voucher.hotelPerNight || 0)
  const vehicleTotal = (voucher.privateVehicleMiles || 0) * (voucher.privateVehicleRate || 0)

  return (
    <div className="max-w-4xl mx-auto p-6 border-2 border-gray-800 my-8 bg-white font-mono" id="print-area">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-2 h-16" />
        <h1 className="text-2xl font-bold">GHANA WATER LIMITED</h1>
        <h2 className="text-xl">ASHANTI SOUTH REGION</h2>
        <h3 className="text-xl underline">TRAVEL EXPENSE VOUCHER</h3>
        <div className="flex justify-between mt-2 px-4">
          <span>Original</span>
          <span>Duplicate</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div><strong>EMPLOYEE:</strong> {voucher.employee}</div>
        <div><strong>POST:</strong> {voucher.post}</div>
        <div><strong>DISTRICT:</strong> {voucher.district}</div>
        <div><strong>ACTIVITY:</strong> {voucher.activity}</div>
        <div className="col-span-2"><strong>PURPOSE:</strong> {voucher.purpose}</div>
        <div className="col-span-2"><strong>ALLOWANCE MONTH:</strong> {voucher.allowanceMonth}</div>
      </div>

      <table className="w-full border-collapse border border-black mb-4">
        <thead><tr><th className="border p-2">Hotel/Guest House</th><th className="border p-2">Nights</th><th className="border p-2">Per day</th><th className="border p-2">Actual</th></tr></thead>
        <tbody><tr><td className="border p-2">Hotel/Guest House</td><td className="border p-2">{voucher.hotelNights || 0}</td><td className="border p-2">{voucher.hotelPerNight?.toFixed(2) || '0.00'}</td><td className="border p-2">{hotelActual.toFixed(2)}</td></tr></tbody>
      </table>

      <table className="w-full border-collapse border border-black mb-4">
        <thead><tr><th className="border p-2">Direct Travel Cost</th><th className="border p-2">GH¢</th></tr></thead>
        <tbody>
          <tr><td className="border p-2">By Air</td><td className="border p-2">{voucher.byAir?.toFixed(2) || '0.00'}</td></tr>
          <tr><td className="border p-2">By Rail</td><td className="border p-2">{voucher.byRail?.toFixed(2) || '0.00'}</td></tr>
          <tr><td className="border p-2">By Private Vehicle</td><td className="border p-2">{voucher.privateVehicleMiles || 0} miles @ {voucher.privateVehicleRate?.toFixed(2) || '0.00'} = {vehicleTotal.toFixed(2)}</td></tr>
          <tr><td className="border p-2">Toll, etc.</td><td className="border p-2">{voucher.tolls?.toFixed(2) || '0.00'}</td></tr>
          <tr><td className="border p-2">Miscellaneous</td><td className="border p-2">{voucher.miscellaneous?.toFixed(2) || '0.00'}</td></tr>
        </tbody>
      </table>

      <div className="text-right font-bold text-xl">Total: GH¢ {voucher.totalAmount?.toFixed(2)}</div>

      <div className="mt-4"><strong>Account:</strong> {voucher.accountCode} &nbsp; <strong>Code:</strong> </div>
      <div><strong>DATE:</strong> {voucher.date} 20......</div>

      {/* Signature blank lines (same as before) */}
      <div className="mt-6 border-t pt-4">
        <div className="flex mb-2"><span className="w-32 font-bold">CLAIMANT</span><span className="border-b flex-1 ml-2"></span></div>
        <div className="flex mb-2"><span className="w-32 font-bold">D.D.O. / D.C.O.</span><span className="border-b flex-1 ml-2"></span></div>
        <div className="flex mb-2"><span className="w-32 font-bold">DISTRICT/UNIT HEAD</span><span className="border-b flex-1 ml-2"></span></div>
        <div className="flex mb-2"><span className="w-32 font-bold">SECTIONAL HEAD</span><span className="border-b flex-1 ml-2"></span></div>
        <div className="flex mb-2"><span className="w-32 font-bold">REGIONAL CHIEF MANAGER</span><span className="border-b flex-1 ml-2"></span></div>
        <div className="flex mb-2"><span className="w-32 font-bold">Approved</span><span className="font-bold ml-2">DATE</span><span className="border-b w-28 ml-2"></span></div>
        <div className="flex flex-wrap mt-4"><span className="font-bold">Received this</span><span className="border-b w-16 mx-2"></span><span>day of</span><span className="border-b w-24 mx-2"></span><span>20</span><span className="border-b w-12 mx-1"></span><span>in payment of the above account the sum of</span><span className="border-b flex-1 ml-2"></span></div>
        <div className="flex mt-4"><span className="font-bold">Witness to Mark and Payments</span><span className="border-b flex-1 ml-4"></span></div>
        <div className="flex mt-2"><span className="font-bold">Signature of Receiver</span><span className="border-b flex-1 ml-4"></span></div>
      </div>

      <div className="text-center text-sm mt-6 pt-2 border-t">G.W.L. ACCTS. FORMS 8</div>

      <div className="no-print flex justify-center mt-6">
        <PrintButton targetId="print-area" />
      </div>
    </div>
  )
}