import {NextResponse} from 'next/server';
import {AxiosApi} from '@/services/axios/AxiosApi';
import {destroyReportSchema} from '@/validators/destroyReportSchema';
import {DestroyReportPayload} from '@/types/destroyReport';
import {ZodError} from "zod";
import {AxiosError} from "axios";

export async function GET() {
  try {
    const {data} = await AxiosApi.get(
      '/user/report-destroy-form/response-destroy'
    );
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

export async function POST(req: Request) {
  try {
    const body: DestroyReportPayload = await req.json();

    const parsed = destroyReportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {error: 'خطای اعتبارسنجی', details: parsed.error.errors},
        {status: 400}
      );
    }

    const {data} = await AxiosApi.post('/user/report-destroy-form', body);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {error: 'خطای اعتبارسنجی', details: error.errors},
        {status: 400}
      );
    }

    if (error instanceof AxiosError) {
      const status = error.response?.status || 500;
      const data = error.response?.data;

      let message = 'خطایی رخ داده است.';

      if (Array.isArray(data?.message) && data.message[0]?.title) {
        message = data.message[0].title;
      } else if (typeof data?.message === 'string') {
        message = data.message;
      } else if (typeof data?.error === 'string') {
        message = data.error;
      } else if (error.message) {
        message = error.message;
      }

      return NextResponse.json({error: message}, {status});
    }

    return NextResponse.json(
      {error: error?.message || 'خطای ناشناخته'},
      {status: 500}
    );
  }
}
