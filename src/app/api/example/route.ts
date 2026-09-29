import { NextResponse, type NextRequest } from 'next/server';
import { paid } from '@/lib/paid';

export const runtime = 'nodejs';

// Replace this with what your service sells. Keep the price and description in
// src/lib/endpoints.ts; this file is only the work itself.
export const GET = paid('/api/example', async (req: NextRequest) => {
  const name = req.nextUrl.searchParams.get('name')?.slice(0, 50) || 'agent';
  return NextResponse.json({ message: `Hello, ${name}. You paid $0.001 in USDC.` });
});
