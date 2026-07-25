import { NextResponse } from 'next/server';
import statsService from '@/services/statsService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await statsService.getStatsData(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
