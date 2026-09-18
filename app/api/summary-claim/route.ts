import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const claim = await prisma.summaryClaim.create({
      data: {
        month: data.month,
        district: data.district,
        preparedBy: data.preparedBy || null,
        staffEntries: JSON.stringify(data.staffEntries),
      }
    })
    return NextResponse.json({ id: claim.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}