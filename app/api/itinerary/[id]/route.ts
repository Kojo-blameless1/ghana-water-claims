import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define the correct types for the request
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 👇 This is the key change: await the params Promise first
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid itinerary ID' }, { status: 400 });
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: { id: id },
    });

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: itinerary.id,
      entries: JSON.parse(itinerary.entries),
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}