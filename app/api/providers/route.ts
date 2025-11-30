import { NextRequest, NextResponse } from "next/server";
import { ProviderService } from "../../../lib/database/providers";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const providers = await ProviderService.getAll();
    return NextResponse.json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const provider = await ProviderService.create(body);
    return NextResponse.json(provider, { status: 201 });
  } catch (error) {
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}
