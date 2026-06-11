import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const data = await request.json()
  
  const hotelActual = (data.hotelNights || 0) * (data.hotelPerNight || 0)
  const vehicleTotal = (data.privateVehicleMiles || 0) * (data.privateVehicleRate || 0)
  const total = hotelActual + (data.byAir || 0) + (data.byRail || 0) + 
                vehicleTotal + (data.tolls || 0) + (data.miscellaneous || 0)

  const voucher = await prisma.travelVoucher.create({
    data: {
      ...data,
      hotelActual,
      totalAmount: total,
    }
  })
  
  return NextResponse.json({ id: voucher.id })
}