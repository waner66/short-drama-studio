import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET(req: NextRequest) {
  return NextResponse.json([]);
}
