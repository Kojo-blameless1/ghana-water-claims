import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const voucher = await prisma.travelVoucher.create({
      data: {
        employee: data.employee || "",
        post: data.post || "",
        district: data.district || "",
        purpose: data.purpose || "",
        allowanceMonth: data.allowanceMonth || "",
        totalAmount: data.totalAmount || 0,

        itineraryEntries: JSON.stringify(data.entries || []),
      },
    });

    return NextResponse.json({ id: voucher.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}