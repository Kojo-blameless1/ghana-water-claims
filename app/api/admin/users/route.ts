import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, staffNo: true, name: true,
      username: true, role: true, approved: true, createdAt: true,
    },
  });

  return NextResponse.json(users);
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, action } = await request.json();

  if (action === "approve") {
    await prisma.user.update({ where: { id: userId }, data: { approved: true } });
    return NextResponse.json({ message: "User approved" });
  }

  if (action === "promote") {
    await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
    return NextResponse.json({ message: "User promoted to admin" });
  }

  if (action === "demote") {
    await prisma.user.update({ where: { id: userId }, data: { role: "USER" } });
    return NextResponse.json({ message: "User demoted to user" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}