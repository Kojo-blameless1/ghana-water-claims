import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { staffNo: (session.user as any)?.staffNo || session.user?.email || "" },
  });
  if (!user) return NextResponse.json([]);

  const vouchers = await prisma.travelVoucher.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, employee: true, date: true, totalAmount: true, allowanceMonth: true, createdAt: true },
  });

  return NextResponse.json(vouchers);
}