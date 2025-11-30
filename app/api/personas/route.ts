import { NextRequest, NextResponse } from "next/server";
import { PersonaService } from "../../../lib/database/personas";

export async function GET() {
  try {
    const personas = await PersonaService.getAll();
    return NextResponse.json(personas);
  } catch (error) {
    console.error("Error fetching personas:", error);
    return NextResponse.json(
      { error: "Failed to fetch personas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const persona = await PersonaService.create(body);
    return NextResponse.json(persona, { status: 201 });
  } catch (error) {
    console.error("Error creating persona:", error);
    return NextResponse.json(
      { error: "Failed to create persona" },
      { status: 500 }
    );
  }
}
