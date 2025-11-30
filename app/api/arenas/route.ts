import { NextRequest, NextResponse } from "next/server";
import { ArenaService } from "../../../lib/database/arenas";

export async function GET() {
  try {
    const arenas = await ArenaService.getAll();
    return NextResponse.json(arenas);
  } catch (error) {
    console.error("Error fetching arenas:", error);
    return NextResponse.json(
      { error: "Failed to fetch arenas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const arena = await ArenaService.create(body);
    return NextResponse.json(arena, { status: 201 });
  } catch (error) {
    console.error("Error creating arena:", error);
    return NextResponse.json(
      { error: "Failed to create arena" },
      { status: 500 }
    );
  }
}
