import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const hotelActual = (data.hotelNights || 0) * (data.hotelPerNight || 0)
    const vehicleTotal = (data.privateVehicleMiles || 0) * (data.privateVehicleRate || 0)
    const total =
      hotelActual +
      (data.byAir || 0) +
      (data.byRail || 0) +
      vehicleTotal +
      (data.tolls || 0) +
      (data.miscellaneous || 0)

    const voucher = await prisma.travelVoucher.create({
      data: {
        employee: data.employee,
        post: data.post,
        district: data.district,
        activity: data.activity,
        purpose: data.purpose,
        allowanceMonth: data.allowanceMonth,
        hotelNights: data.hotelNights || 0,
        hotelPerNight: data.hotelPerNight || 0,
        hotelActual,
        byAir: data.byAir || 0,
        byRail: data.byRail || 0,
        privateVehicleMiles: data.privateVehicleMiles || 0,
        privateVehicleRate: data.privateVehicleRate || 0,
        tolls: data.tolls || 0,
        miscellaneous: data.miscellaneous || 0,
        totalAmount: total,
        accountCode: data.accountCode,
        date: data.date,
        itineraryEntries: JSON.stringify(data.itineraryEntries || []),
      },
    })

    return NextResponse.json({ id: voucher.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}