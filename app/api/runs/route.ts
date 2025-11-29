import { NextRequest, NextResponse } from "next/server";
import { RunService } from "../../../lib/database/runs";

export async function GET() {
  try {
    const runs = await RunService.getAllServer();
    return NextResponse.json(runs);
  } catch (error) {
    console.error("Error fetching runs:", error);
    return NextResponse.json(
      { error: "Failed to fetch runs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const run = await RunService.createServer(body);
    return NextResponse.json(run, { status: 201 });
  } catch (error) {
    console.error("Error creating run:", error);
    return NextResponse.json(
      { error: "Failed to create run" },
      { status: 500 }
    );
  }
}
