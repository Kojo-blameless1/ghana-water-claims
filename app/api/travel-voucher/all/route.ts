import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vouchers = await prisma.travelVoucher.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, employee: true, date: true, district: true, totalAmount: true, allowanceMonth: true, createdAt: true },
  });

  return NextResponse.json(vouchers);
}