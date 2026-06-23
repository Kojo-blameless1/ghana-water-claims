import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const claims = await prisma.summaryClaim.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, district: true, month: true, preparedBy: true, createdAt: true },
  });

  return NextResponse.json(claims);
}