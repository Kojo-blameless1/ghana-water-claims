import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const itinerary = await prisma.itinerary.create({
      data: {
        entries: JSON.stringify(data.entries),
      }
    })
    return NextResponse.json({ id: itinerary.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}