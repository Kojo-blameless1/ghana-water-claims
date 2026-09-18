import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { staffNo, name, username, password } = await request.json();

    if (!staffNo || !name || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check duplicates
    const existing = await prisma.user.findFirst({
      where: { OR: [{ staffNo }, { username }] },
    });
    if (existing) {
      if (existing.staffNo === staffNo)
        return NextResponse.json({ error: "Staff number already registered" }, { status: 400 });
      if (existing.username === username)
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { staffNo, name, username, passwordHash, role: "USER", approved: false },
    });

    return NextResponse.json({ message: "Registration successful. Await admin approval." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}