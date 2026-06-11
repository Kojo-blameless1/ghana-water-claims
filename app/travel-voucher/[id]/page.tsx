import prisma from '@/lib/prisma'
import PrintButton from '@/components/PrintButton'

export default async function ViewVoucher({ params }: { params: { id: string } }) {
  const voucher = await prisma.travelVoucher.findUnique({
    where: { id: parseInt(params.id) }
  })
  if (!voucher) return <div>Not found</div>

  return (
    <div className="max-w-4xl mx-auto p-6 border my-8 bg-white" id="print-area">
      <h1 className="text-xl font-bold text-center">GHANA WATER LIMITED - TRAVEL EXPENSE VOUCHER</h1>
      <div className="mt-4">
        <p><strong>Employee:</strong> {voucher.employee}</p>
        <p><strong>Post:</strong> {voucher.post}</p>
        <p><strong>District:</strong> {voucher.district}</p>
        <p><strong>Activity:</strong> {voucher.activity}</p>
        <p><strong>Purpose:</strong> {voucher.purpose}</p>
        <p><strong>Month:</strong> {voucher.allowanceMonth}</p>
        <hr className="my-2" />
        <p><strong>Hotel:</strong> {voucher.hotelNights || 0} nights × {voucher.hotelPerNight || 0} = {voucher.hotelActual}</p>
        <p><strong>Air:</strong> {voucher.directAir || 0}</p>
        <p><strong>Rail:</strong> {voucher.directRail || 0}</p>
        <p><strong>Private vehicle:</strong> {voucher.privateVehicleMiles || 0} miles @ {voucher.privateVehicleRate || 0} = {(voucher.privateVehicleMiles || 0) * (voucher.privateVehicleRate || 0)}</p>
        <p><strong>Tolls:</strong> {voucher.tolls || 0}</p>
        <p><strong>Misc:</strong> {voucher.miscellaneous || 0}</p>
        <p className="font-bold">Total GH¢: {voucher.totalAmount}</p>
      </div>
      <PrintButton targetId="print-area" />
    </div>
  )
}