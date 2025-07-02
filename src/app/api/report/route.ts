import { NextResponse } from 'next/server';
import AxiosApi from '@/services/axios/AxiosApi';
import { destroyReportSchema } from '@/validators/destroyReportSchema';
import { DestroyReportPayload } from '@/types/destroyReport';

export async function GET() {
  try {
    const { data } = await AxiosApi.get(
      '/user/report-destroy-form/response-destroy'
    );
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: DestroyReportPayload = await req.json();

    const parsed = destroyReportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { data } = await AxiosApi.post('/user/report-destroy-form', body);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}
