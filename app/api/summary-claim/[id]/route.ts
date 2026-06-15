import { NextResponse } from "next/server";
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

    const claim = await prisma.summaryClaim.findUnique({
      where: { id: numId },
    });
    if (!claim)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(claim);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
