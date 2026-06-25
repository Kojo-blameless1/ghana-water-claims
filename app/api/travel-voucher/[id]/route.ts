import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const numId = parseInt(id);
    if (isNaN(numId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const voucher = await prisma.travelVoucher.findUnique({
      where: { id: numId },
    });
    if (!voucher)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(voucher);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const numId = parseInt(id);
    if (isNaN(numId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const data = await request.json();

    const hotelActual = (data.hotelNights || 0) * (data.hotelPerNight || 0);
    const vehicleTotal = (data.privateVehicleMiles || 0) * (data.privateVehicleRate || 0);
    const total =
      hotelActual +
      (data.byAir || 0) +
      (data.byRail || 0) +
      vehicleTotal +
      (data.tolls || 0) +
      (data.miscellaneous || 0);

    const voucher = await prisma.travelVoucher.update({
      where: { id: numId },
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
    });

    return NextResponse.json({ id: voucher.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const numId = parseInt(id);
    if (isNaN(numId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await prisma.travelVoucher.delete({ where: { id: numId } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}